import { LocalStorage } from "quasar";

const state = {
  settings: {
    text: "",
    FG: "#000",
    BG: "#fff",
    size: 200
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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
