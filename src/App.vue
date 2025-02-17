<template>
  <v-app>
    <div v-if="!isLogin">
      <Login />
    </div>    
    <div v-if="isLogin">
      <router-view />
    </div>
    <!-- <div class="row justify-content-center">
        <p class="copyright-text">Copyright &copy; 2022 All Rights Reserved by 
        <a>Adara Pedan</a>.
        </p>
    </div>       -->
  </v-app>
</template>

<script>
import Login from './components/Login.vue'
import {mapActions} from 'vuex'
export default {
  name: 'app',
  data(){
    return{

    }
  },
  components: {
    Login
  },  
  computed:{
    isLogin(){
      return this.$store.state.isLogin
    },
    getRole(){
      return this.$store.state.userRole
    }      
  },
  methods:{
        ...mapActions({
            fetchShift: 'shift/getDataShift'
        }),        
  },
  created () {
    if(localStorage.getItem('token')){
      this.$store.commit('setUser',localStorage.getItem('user'))
      this.$store.commit('setRole',localStorage.getItem('role'))
      this.$store.commit('setEmail',localStorage.getItem('email'))
      this.$store.commit('setUserId',localStorage.getItem('userId'))  
      if(this.getRole === 'kasir' ){
        this.fetchShift()
      }      
      this.$store.commit('setLogin', true)
    }else{
      this.$store.commit('setLogin', false)
    }
  }
}
</script>

<style>
.text-start{
  font-size: xx-small;
}
.bg-header {
  background-color: #ffffff;
}
.input-group-text {
  background-color: #fff;
}
.copyright-text
{
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    margin:5px
}
</style>