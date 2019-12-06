<template>
  <div>
    <div class="qr-wrapper row q-pa-lg">
      <!-- <vue-drag-resize
        :isActive="true"
        :isDraggable="false"
        :w="size"
        :h="size"
        :sticks="['tl', 'tr', 'bl', 'br']"
        :aspectRatio="true"
      > -->
      <canvas
        v-show="text.length > 0"
        id="canvas"
        class="qrcode-image"
      ></canvas>
      <canvas v-show="false" id="mirror" class="qrcode-image"></canvas>
      <!-- </vue-drag-resize> -->
      <div class="blank" v-show="text.length == 0"></div>
    </div>
    <q-input
      v-model="text"
      label="Write QRCode text here"
      class="row q-px-lg"
      @keyup.enter="openFile"
    >
      <template v-if="text.length" v-slot:append>
        <q-icon name="mdi-close" class="cursor-pointer" @click="text = ''" />
      </template>
    </q-input>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import spy from "cep-spy";
import { evalScript } from "cluecumber";
const fs = require("fs");
// import VueDragResize from "vue-drag-resize";
const QRCode = require("qrcode");

export default {
  computed: {
    ...mapGetters("settings", ["settings"]),
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
    if (this.text.length) this.drawQR();
  },
  watch: {
    text(val) {
      if (val) this.drawQR();
    },
    size(val) {
      if (val) this.drawQR();
    },
    BG(val) {
      if (val) this.drawQR();
    },
    FG(val) {
      if (val) this.drawQR();
    }
  },
  methods: {
    ...mapActions("settings", ["setText", "setFG", "setBG"]),
    drawQR() {
      let canvas = document.getElementById("canvas");
      let mirror = document.getElementById("mirror");
      const self = this;
      QRCode.toCanvas(
        canvas,
        this.text,
        {
          width: 200,
          color: {
            light: self.BG,
            dark: self.FG
          }
        },
        error => {
          if (error) console.error(error);
        }
      );
      QRCode.toCanvas(
        mirror,
        this.text,
        {
          width: self.size,
          color: {
            light: self.BG,
            dark: self.FG
          }
        },
        error => {
          if (error) console.error(error);
        }
      );
    },
    openFile() {
      let dataURL = document.getElementById("mirror").toDataURL();
      var buf = new Buffer(
        dataURL.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      let path = `${spy.path.root}/temp/${this.text.replace(/\s/gm, "-")}.png`;
      fs.writeFileSync(path, buf);
      evalScript(`placeImage('${path}')`);
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

.blank {
  width: 200px;
  height: 200px;
}
</style>
