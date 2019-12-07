<template>
  <div>
    <div class="qr-wrapper row ">
      <canvas
        v-show="text.length > 0"
        id="barcanvas"
        class="barcode-image"
      ></canvas>
      <div class="blank" v-show="text.length == 0"></div>
    </div>
    <Inputter @submitted="openFile" />
    <BarOptions />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import spy from "cep-spy";
import { evalScript } from "cluecumber";
const fs = require("fs");
const JsBarcode = require("jsbarcode");

export default {
  data: () => ({}),
  components: {
    Inputter: require("./Inputter.vue").default,
    BarOptions: require("./BarOptions.vue").default
  },
  computed: {
    ...mapGetters("settings", ["settings", "barCodeOptions"]),
    app() {
      return this.$root.$children[0];
    },
    format() {
      console.log(this.settings.format);
      return this.settings.format;
    },
    text: {
      get() {
        return this.settings.text;
      },
      set(val) {
        this.setText(val);
      }
    },
    FG: {
      get() {
        return this.settings.FG;
      },
      set(val) {
        this.setFG(val);
      }
    },
    size() {
      return this.settings.size;
    },
    BG: {
      get() {
        return this.settings.BG;
      },
      set(val) {
        this.setBG(val);
      }
    }
  },
  mounted() {
    if (this.text.length) this.draw();
  },
  watch: {
    text(val) {
      if (val) this.draw();
    },
    size(val) {
      if (val) this.draw();
    },
    BG(val) {
      if (val) this.draw();
    },
    FG(val) {
      if (val) this.draw();
    },
    format(val) {
      if (val) this.draw();
    }
  },
  methods: {
    ...mapActions("settings", ["setText", "setFG", "setBG"]),
    generateSVG() {
      const self = this;
      const { DOMImplementation, XMLSerializer } = require("xmldom");
      const xmlSerializer = new XMLSerializer();
      const document = new DOMImplementation().createDocument(
        "http://www.w3.org/1999/xhtml",
        "html",
        null
      );
      const svgNode = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      let opts = {
        xmlDocument: document
      };
      Object.assign(opts, this.barCodeOptions);
      JsBarcode(svgNode, this.text, opts);
      return xmlSerializer.serializeToString(svgNode);
    },
    draw() {
      let canvas = document.getElementById("barcanvas");
      // let mirror = document.getElementById("barmirror");
      const self = this;
      console.log(`Redraw as ${this.format}`);

      let opts = {
        background: self.BG,
        lineColor: self.FG
      };
      Object.assign(opts, this.barCodeOptions);
      console.log(opts);
      JsBarcode(canvas, self.text, opts);
    },
    async openFile() {
      if (!this.text.length) return null;
      let path = `${spy.path.root}/temp/barcode.svg`;
      fs.writeFileSync(path, this.generateSVG());
      await evalScript(`placeSVG('${path}', '${this.settings.text}')`);
      console.log("placed");
      setTimeout(() => {
        evalScript("replaceFontWithOCRB()");
      }, 200);
      // this.app.openFile();
    }
  }
};
</script>

<style>
.qr-wrapper,
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.qr-wrapper {
  height: 200px;
}

.blank {
  width: 200px;
  height: 200px;
}

#barcanvas {
  max-width: 100vw;
}
</style>
