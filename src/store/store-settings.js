import { LocalStorage } from "quasar";

const state = {
  settings: {
    text: "",
    FG: "#000",
    BG: "#fff",
    size: 200,
    //
    format: "EAN13",
    model: "EAN",
    variant: "13",
    displayValue: true,
    textAlign: "center",
    textPosition: "bottom",
    textMargin: 2,
    fontSize: 20,
    margin: 10,
    flat: false,
    font: "OCR"
  }
};

const mutations = {
  setText(state, value) {
    state.settings.text = value;
  },
  setFG(state, value) {
    state.settings.FG = value;
  },
  setBG(state, value) {
    state.settings.BG = value;
  },
  setSize(state, value) {
    state.settings.size = value;
  },
  setFormat(state) {
    state.settings.format = `${state.settings.model}${state.settings.variant ||
      ""}`;
  },
  setModel(state, value) {
    state.settings.model = value;
  },
  setVariant(state, value) {
    state.settings.variant = value || "";
  },
  setSettings(state, value) {
    Object.assign(state.settings, value);
  }
};

const actions = {
  setText({ commit, dispatch }, value) {
    commit("setText", value);
    dispatch("saveSettings");
  },
  setSize({ commit, dispatch }, value) {
    commit("setSize", value);
    dispatch("saveSettings");
  },
  setFG({ commit, dispatch }, value) {
    commit("setFG", value);
    dispatch("saveSettings");
  },
  setBG({ commit, dispatch }, value) {
    commit("setBG", value);
    dispatch("saveSettings");
  },
  setModel({ commit, dispatch }, value) {
    commit("setModel", value);
    commit("setFormat");
    dispatch("saveSettings");
  },
  setVariant({ commit, dispatch }, value) {
    commit("setVariant", value);
    commit("setFormat");
    dispatch("saveSettings");
  },
  getSettings({ commit }) {
    let settings = LocalStorage.getItem("settings");
    if (settings) commit("setSettings", settings);
  },
  saveSettings({ state }) {
    LocalStorage.set("settings", state.settings);
  }
};

const getters = {
  settings: state => {
    return state.settings;
  },
  format: state => {
    return `${state.settings.model}${state.settings.variant}`;
  },
  barCodeOptions: state => {
    return {
      format: `${state.settings.model}${state.settings.variant}`,
      text: state.settings.text,
      displayValue: state.settings.displayValue,
      textAlign: state.settings.textAlign,
      textPosition: state.settings.textPosition,
      textMargin: state.settings.textMargin,
      fontSize: state.settings.fontSize,
      margin: state.settings.margin,
      flat: state.settings.flat,
      font: state.settings.font
    };
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
