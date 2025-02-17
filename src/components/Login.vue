<template>
  <v-app>
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-md-2"></div>
            <div class="col-lg-6 col-md-8 login-box">
                <div class="col-lg-12 login-key">
                    <!-- <img src="../assets/adaraLogo.png" width="150" alt="icon"> -->
                </div>
                <div class="col-lg-12 login-title">
                    FREE TRIAL
                </div>

                <div class="col-lg-12 login-form">
                    <div class="col-lg-12 login-form">
                            <div class="form-group">
                                <label class="form-control-label">EMAIL</label>
                        
                                <input v-model="email" type="text" class="form-control" v-on:keyup.enter="login()">
                            </div>
                            <div class="form-group">
                                <label class="form-control-label">PASSWORD</label>
                                <input v-model="password" :type="type" class="form-control" i v-on:keyup.enter="login()">
                                <b-form-checkbox
                                id="checkbox-1"
                                v-model="status"
                                name="checkbox-1"
                                value="true"
                                unchecked-value="not_accepted"
                                class="form-control-label"
                                >
                                Show Password
                                </b-form-checkbox>                                
                            </div>

                            <div class="col-lg-12 loginbttm">                            
                                <div class="col-lg-12 login-btm login-button">
                                    <button @click.prevent="login()" class="btn btn-outline-primary">LOGIN</button>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-2"></div>
            </div>
        </div>  
    </div>        
</v-app>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import {mapActions} from 'vuex'


export default {
  name: 'Login',
  data(){
    return{
      email: '',
      password: '',
      type:'password',
      status: 'false'
    }
  },
  computed:{
    getRole(){
      return this.$store.state.userRole
    }      
  },
  methods:{
    ...mapActions({
        fetchShift: 'shift/getDataShift'
    }),        
    login(){
       axios({
            url: `https://kueku-server-15ecaf79af24.herokuapp.com/user/admin/login`,
            method: 'post',
            data:{
              email: this.email,
              password: this.password
            }
            })
            .then(({data})=>{
                this.email = ''
                this.password = ''
                localStorage.setItem('token',data.token)
                localStorage.setItem('user',data.user.username)  
                localStorage.setItem('email',data.user.email)                
                localStorage.setItem('userId',data.user._id)                
                localStorage.setItem('role',data.user.role)
                this.$store.commit('setUser',data.user.username)
                this.$store.commit('setEmail',data.user.email)
                this.$store.commit('setUserId',data.user._id)    
                this.$store.commit('setRole',data.user.role)    
                if(this.getRole === 'kasir' ){
                    this.fetchShift()
                    this.$router.push('/shift')
                }else{
                    this.$router.push('/')
                }                             
                this.$store.commit('setLogin',true)
            })
            .catch(err=>{
                console.log('masuk')
              if(err.response.status === 401){
                Swal.fire({
                  icon: 'error',
                  title: 'password salah !',
                  text: err.errors,
                })
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'email salah !',
                  text: err.errors,
                })
              }
            })
    }
  },
    watch: {
        status: function(){
            if(this.type === 'password'){
                this.type = 'text'
            }else{
                this.type = 'password'
            }
        }
    },  

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


/* new */
body {
    background: #222D32;
    font-family: 'Roboto', sans-serif;
}

.login-box {
    margin-top: 10px;
    height: auto;
    background: #1A2226;
    text-align: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.login-key {
    height: 100px;
    font-size: 80px;
    line-height: 100px;
    background: -webkit-linear-gradient(#27EF9F, #0DB8DE);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.login-title {
    margin-top: 15px;
    text-align: center;
    font-size: 30px;
    letter-spacing: 2px;
    margin-top: 15px;
    font-weight: bold;
    color: #ECF0F5;
}

.login-form {
    margin-top: 25px;
    text-align: left;
}

input[type=text] {
    background-color: #1A2226;
    border: none;
    border-bottom: 2px solid #0DB8DE;
    border-top: 0px;
    border-radius: 0px;
    font-weight: bold;
    outline: 0;
    margin-bottom: 20px;
    padding-left: 0px;
    color: #ECF0F5;
}

input[type=password] {
    background-color: #1A2226;
    border: none;
    border-bottom: 2px solid #0DB8DE;
    border-top: 0px;
    border-radius: 0px;
    font-weight: bold;
    outline: 0;
    padding-left: 0px;
    margin-bottom: 20px;
    color: #ECF0F5;
}

.form-group {
    margin-bottom: 40px;
    outline: 0px;
}

.form-control:focus {
    border-color: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-bottom: 2px solid #0DB8DE;
    outline: 0;
    background-color: #1A2226;
    color: #ECF0F5;
}

input:focus {
    outline: none;
    box-shadow: 0 0 0;
}

label {
    margin-bottom: 0px;
}

.form-control-label {
    font-size: 10px;
    color: #6C6C6C;
    font-weight: bold;
    letter-spacing: 1px;
}

.btn-outline-primary {
    border-color: #0DB8DE;
    color: #0DB8DE;
    border-radius: 0px;
    font-weight: bold;
    letter-spacing: 1px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.btn-outline-primary:hover {
    background-color: #0DB8DE;
    right: 0px;
}

.login-btm {
    float: left;
}

.login-button {
    padding-right: 0px;
    text-align: right;
    margin-bottom: 25px;
}

.login-text {
    text-align: left;
    padding-left: 0px;
    color: #A2A4A4;
}

.loginbttm {
    padding: 0px;
}
</style>
