import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allPosts: [],
    newPost: {},
    allComments: []
  },
  mutations: {
    getAllPosts(state, payload) {
      state.allPosts = payload;

    },
    addNewPost(state, payload) {
      state.allPosts.push(payload)
    },
    deletePost(state, payload) {
      let output = [];
      state.allPosts.forEach((post) => {
        if (post.id !== payload.id) {
          output.push(post)
        }
      });
      state.allPosts = output;
    },
    getComments(state, payload) {
      state.allComments = payload;
    },
    editPost(state, payload) {
      state.allPosts.forEach((post) => {
        if (post.id === payload.id) {
          post = payload
        }
      })
    },
    deleteComments(state) {
      state.allComments = [];
    }
  },
  actions: {
    async setAllPosts(context) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => response.json())
        .then((json) => json);
      const firstData = response;
      context.commit('getAllPosts', firstData)
    },
    addNewPost(context, payload) {
      context.commit('addNewPost', payload)
    },
    async deletePost(context, payload) {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${payload.id}`, {
        method: 'DELETE',
      });
      context.commit('deletePost', payload)
    },
    async getComments(context, payload) {
      const comments = await fetch(`https://jsonplaceholder.typicode.com/posts/${payload}/comments`)
        .then((response) => response.json())
        .then((json) => json);
      context.commit('getComments', comments);
    },
    async editPost(context, payload) {
      const edited = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PATCH',
        body: JSON.stringify({
          payload
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => json);
      context.commit('editPost', edited)
    },
    deleteComments(context) {
      context.commit('deleteComments')
    }
  },
  modules: {
  },
  getters: {
    getAllPosts: state => state.allPosts,
    getNewPost: state => state.newPost,
    getFilteredPosts: state => state.allFilteredPosts,
    allComents: state => state.allComments,
  }
})
