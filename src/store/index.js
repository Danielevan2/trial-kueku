import Vue from 'vue'
import Vuex from 'vuex'
import item from './module/item'
import transaksi from './module/transaksi'
import allUser from './module/user'
import shift from './module/shift'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: null,
    email: null,
    userId:null,
    userRole:''
  },
  mutations: {
    setLogin(state,payload){
      state.isLogin = payload
    },
    setUser(state,payload){
      state.user = payload
    },
    setEmail(state,payload){
      state.email = payload
    },    
    setUserId(state,payload){
      state.userId = payload
    },
    setRole(state,payload){
      state.userRole = payload
    }
  },
  actions: {
  },
  modules: {
    item,
    transaksi,
    allUser,
    shift
  }
})
