export default {
  namespaced: true,

  state: {
    prevUrl: '',
  },

  mutations: {
    setPrevUrl: (state, value) => {
      state.prevUrl = value
    },
  },

  actions: {
    setPrevUrl: ({ commit }, value) => {
      commit('setPrevUrl', value)
    },
  },

  getters: {
    prevUrl: state => state.prevUrl,
  },
}