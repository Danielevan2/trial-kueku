<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Pengguna</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
    <v-btn class="m-3" @click.prevent="dialog = true">+ Pengguna</v-btn>

    <!-- form + pengguna -->
    <v-dialog
    v-model="dialog"
    width="1000"      
    >      
    <b-overlay :show="loading2" rounded="sm">
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Tambah Pengguna
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="username"
                        label="Username"    
                        outlined                        
                        clearable
                        v-on:keyup.enter="tambahUser()"
                    ></v-text-field>      
                </v-col>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                        v-on:keyup.enter="tambahUser()"
                    ></v-text-field>      
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="9">                  
                    <v-text-field
                        v-model="password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        label="Passoword"
                        hint="At least 6 characters"
                        counter
                        @click:append="show1 = !show1"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">                  
                    <v-select
                    v-model="role"
                    :items="items"
                    :rules="[v => !!v || 'Item is required']"
                    label="Jabatan"
                    required
                    ></v-select>
                </v-col>                
            </v-row>                 
            <v-row>
                <v-col cols="12" md="5">
                  <h5>Pin :

                    <PincodeInput
                    v-model="pin"
                    placeholder="0"
                    />
                  </h5>
                  </v-col>
            </v-row>   
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="batal()"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="tambahUser()"
          >
            Tambah
          </v-btn>
        </v-card-actions>
      </v-card>
    </b-overlay>
    </v-dialog>       
    <!-- form + pengguna -->

    <Tabel />
    
    <!-- loading / kosong -->
    <v-row
        align="center"
        justify="center"
        
        class="mt-4"
    >
            <v-card
                dark
                v-if="loading"
            >
                    <v-card-text >
                    Please stand by
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
                    </v-card-text>   
            </v-card>         
    </v-row>  
    <!-- loading / kosong -->

  </div>
</template>

<script>
  import PincodeInput from 'vue-pincode-input'
  import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  import Tabel from '../components/TabelUser.vue'

  export default {
    data() {
      return {
        // form
        loading2:false,
        dialog: false,
        username:'',
        email:'',
        password:'',
        items: ['kasir','admin','super', 'barcode'],
        role:'kasir'    ,
        pin:'',

        // rules
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        show1: false,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 6 || 'Min 6 characters',
          emailMatch: () => (`The email and password you entered don't match`),
        },        
      }
    },
    components: {
        Tabel,
        PincodeInput
    },
    computed:{
        ...mapGetters({
        loading: 'allUser/getLoading2'
        }),        
    },    
    methods: { 
        ...mapActions({
        fetchUser: 'allUser/fetchAction',
        }),               
        batal(){
            this.dialog = false
        }, 
        tambahUser(){
                this.loading2 = true      
                axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/user/admin/register`,
                    method: 'post',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        username:this.username,
                        email:this.email,
                        password:this.password,
                        role:this.role,
                        pin:this.pin
                      }
                    })
                    .then(({data}) =>{
                        this.username = ''
                        this.email = ''
                        this.password = ''
                        this.role = 'kasir'
                        this.pin=''
                        this.loading2 = false
                        this.dialog = false
                        this.fetchUser()
                    })
                    .catch(err=>{
                            this.loading2 = false
                            console.log(err)
                            Swal.fire({
                            icon: 'error',
                            title: 'gagal !',
                            text: err.errors,
                            })                        
                    })         
        },
    }
  }
</script>