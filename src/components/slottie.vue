<template>
  <div class="slottie-container">
    <div class="slottie-animation"></div>
  </div>
</template>

<script>
import * as lottie from "lottie-web";
import loading from "../assets/tutorial-pull.json";

export default {
  name: "slottie",
  data: () => ({
    speed: 1,
    elt: null,
    doneLoading: false,
    animData: null,
    loop: true,
    autoplay: true
  }),
  computed: {
    app() {
      return this.$root.$children[0];
    }
  },
  mounted() {
    this.elt = this.$el.children[0];
    this.init();
  },
  methods: {
    init() {
      this.animData = this.buildAnimation();
      if (this.app.notModal) {
        this.animData.addEventListener("loopComplete", this.isDone);
      }
      this.animData.play();
    },
    isDone() {
      this.$emit("done");
    },
    buildAnimation() {
      const self = this;
      const animData = {
        wrapper: self.elt,
        animType: "svg",
        loop: self.loop,
        prerender: true,
        autoplay: self.autoplay
      };
      animData.animationData = loading;
      return lottie.loadAnimation(animData);
    }
  }
};
</script>

<style>
svg {
  width: 100%;
}

.slottie-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.slottie-animation {
  max-width: 200px;
}

.anim-main {
  fill: var(--color-default);
  stroke: var(--color-default);
}

.anim-mask {
  stroke: var(--color-bg);
  fill: var(--color-bg);
}

.anim-bg {
  stroke: #ddd;
}

.anim-selection {
  stroke: var(--color-selection);
  fill: var(--color-selection);
}

.anim-loaderbg {
  fill: #fff;
}

.anim-indicator {
  stroke-width: 6px;
}
</style>
