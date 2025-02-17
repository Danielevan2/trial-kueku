<template>
  <div class="overflow-auto"> 
    <b-table
      id="my-table"
      :items="allUser"
      :per-page="perPage"
      :fields="fields"
      :current-page="currentPage"
      small
      hover
    >    
        <template #cell(Username)="row">
            <span class="mr-auto">{{row.item.username}}</span>            
        </template>      
        <template #cell(Email)="row">
          <p>{{row.item.email}}</p>
        </template>     
        <template #cell(KodeUser)="row">
          <p>{{row.item.barcode}}</p>
        </template>         
        <template #cell(Role)="row">
            <b-badge variant="primary" v-if="row.item.role === 'admin'">ADMIN</b-badge> 
            <b-badge variant="success" v-if="row.item.role === 'kasir'">KASIR</b-badge>          
            <b-badge variant="warning" v-if="row.item.role === 'super'">SUPER</b-badge>
            <b-badge variant="primary" v-if="row.item.role === 'barcode'">BARCODE</b-badge>          
        </template>          
        <template #cell(Action)="row">
            <a @click="formEdit(row.item)">
              <v-icon color="green" v-b-popover.hover.top="'Edit User'" small>mdi-account-edit</v-icon>
            </a> 
            |             
            <a @click.prevent="deleteUser(row.item._id)" v-if="row.item.role !== 'super'">
                <v-icon color="red" small>mdi-delete</v-icon>
            </a>                                
        </template>                                        
    </b-table>
    
    <b-pagination
      v-if="allUser.length > 0"
      v-model="currentPage"
      :total-rows="totalItem"      
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>  

    <!-- form edit user -->
    <v-dialog
    v-model="dialog"
    width="1000"
    >      
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Edit User
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
                  <b-button v-b-toggle.collapse-1 variant="outline-secondary">Reset Password</b-button>
                  <b-collapse id="collapse-1" class="mt-2">              
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
                  </b-collapse>                
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
            @click="dialog = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="editUser()"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>       
    <!-- form edit user -->   


  </div>

</template>

<script>
    import PincodeInput from 'vue-pincode-input'
    import { mapGetters,mapActions,mapMutations } from 'vuex'
    import Swal from 'sweetalert2'
    import axios from 'axios'

  export default {
    data() {
      return {
        perPage: 5,
        currentPage: 1,

        fields: ['Username','Email','KodeUser', 'Role', 'Action'], 
        src: '',

        // form
        tempId: '',
        dialog: false,
        username:'',
        email:'',
        password:'',
        items: ['kasir','admin','super'],
        role:'kasir',
        pin: '',

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
        PincodeInput
    },    
    computed:{
        ...mapGetters({
        allUser: 'allUser/getAllUser',
        totalItem: 'allUser/getTotalUser'
        }),        
    },    
    methods:{     
        
        ...mapMutations({
          fillData: 'allUser/fillData2',
          fillTotal: 'allUser/fillTotal2',  
          fillLoading: 'allUser/fillLoading2'        
        }),               
        ...mapActions({
        fetchUser: 'allUser/fetchAction',
        }),             

        // edit user
        formEdit(data){
            if(data.pin){
              this.pin = data.pin
            }else{
              this.pin = '0000'
            }
            this.dialog = true
            this.tempId = data._id
            this.username=data.username,
            this.email=data.email,
            this.role=data.role
        },
        editUser(){
                if(this.password === ''){
                    this.password = '-'
                }
                axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/user/admin/${this.tempId}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        username:this.username,
                        email:this.email,
                        password:this.password,
                        role:this.role,  
                        pin : this.pin                 
                    }
                    })
                    .then(({data}) =>{
                        Swal.fire(
                          'Berhasil!',
                          'sukses edit user!',
                          'success'
                        )                      
                        this.dialog = false
                        this.username=''
                        this.email=''
                        this.password=''
                        this.role=''
                        this.pin =''
                        this.fetchUser(this.currentPage,this.perPage)       
                    })
                    .catch(err=>{
                            console.log(err)
                            Swal.fire({
                            icon: 'error',
                            title: 'gagal !',
                            text: err.errors,
                            })                        
                    })         
        },        
        deleteUser(id){
                Swal.fire({
                    title: 'Apakah anda yakin akan menghapus?',
                    showDenyButton: true,
                    confirmButtonText: `Batal`,
                    denyButtonText: `Ya,Hapus`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                            
                    } else if (result.isDenied) {
                        axios({
                        url: `https://kueku-server-15ecaf79af24.herokuapp.com/user/${id}`,
                        method: 'delete',
                        headers:{
                            token : localStorage.getItem('token')
                        }
                        })
                        .then((respone) =>{
                            Swal.fire('deleted!', '', 'success')
                            this.fetchUser(this.currentPage,this.perPage)       
                        })                   
                    }
                })            
        }         
    },
    watch:{
        currentPage: function(){
            this.fetchUser(this.currentPage,this.perPage)
        },       
    },
    created(){
        this.fetchUser(this.currentPage,this.perPage)       
    }
  }
</script>