<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Bundling Produk</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
    <v-btn class="m-3" @click.prevent="dialog = true">+ Tambah Bundling</v-btn>

    <!-- form + bundling -->
    <v-dialog
    v-model="dialog"
    width="1000"      
    >      
    <b-overlay :show="loading2" rounded="sm">
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Tambah Bundling
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="nama"
                        label="Nama Bundling"    
                        outlined                        
                        clearable
                        v-on:keyup.alt="tambahItem()"
                    ></v-text-field>      
                </v-col>
            </v-row>      
            <v-row v-if="getRole === 'super'">
                <v-col cols="12" md="6">                  
                    <v-text-field
                    :label="`Ecer : Rp ${tempHargaEcer}`"
                    v-model="hargaEcer"
                    prefix="Rp"                
                    v-on:keyup.alt="tambahItem()"                                         
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">                  
                    <v-text-field
                    :label="`Grosir : Rp ${tempHargaGrosir}`"
                    v-model="hargaGrosir"
                    prefix="Rp"              
                    v-on:keyup.alt="tambahItem()"                                             
                    ></v-text-field>
                </v-col>                
            </v-row>          
            <v-row v-if="getRole === 'super'">
<v-col cols="12" md="2">                  
    <v-btn class="m-3" @click.prevent="dialog2 = true">+ Produk</v-btn>   

    <!-- form + produk -->
    <v-dialog
    v-model="dialog2"
    width="1000"      
    >      
    <b-overlay :show="loading2" rounded="sm">
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Tambah Produk
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- tabel all produk -->
                <v-text-field                    
                    solo
                    label="Search"
                    append-icon="mdi-magnify"
                    v-on:keyup.enter="search(1)"
                    class="mr-4 ml-4"
                    clearable
                    v-model="src"
                ></v-text-field>              
                <v-data-table
                    :headers="headers2"
                    :items="allItem"
                    class="elevation-1"
                    :items-per-page="10"
                    :loading="loading"
                >
                    <template v-slot:item.hargaEcer="{ item }">
                    <p>Rp {{getRupiah( item.hargaEcer)}}</p>
                    </template>  
                    <template v-slot:item.hargaGrosir="{ item }">
                    <p>Rp {{getRupiah( item.hargaGrosir)}}</p>
                    </template>          
                    <template v-slot:item.actions="{ item }">
                        <a @click="plusItem(item)">
                        <v-icon color="green" v-b-popover.hover.top="'Tambah Item'" dense>mdi-cart-plus</v-icon>
                        </a> 
                    </template>    
                </v-data-table>
            <!-- tabel all produk -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog2 = false"
          >
            Selesai
          </v-btn>
        </v-card-actions>
      </v-card>
    </b-overlay>
    </v-dialog>       
    <!-- form + produk -->
</v-col>
<v-col cols="12" md="10">                  
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
    >
        <template v-slot:item.hargaEcer="{ item }">
          <p>Rp {{getRupiah( item.hargaEcer)}}</p>
        </template>  
        <template v-slot:item.hargaGrosir="{ item }">
          <p>Rp {{getRupiah( item.hargaGrosir)}}</p>
        </template>  
        <template v-slot:item.actions="{ item }">
        <v-icon
            small
            @click="deleteItem(item)"
            v-b-popover.hover.top="'Delete'"
        >
            mdi-delete
        </v-icon>
        </template>    
    </v-data-table>
</v-col>
            </v-row>
          </v-container>
          <small>*harga ecer dan grosir wajib diisi</small>
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
            @click="batal()"
          >
            Tambah
          </v-btn>
        </v-card-actions>
      </v-card>
    </b-overlay>
    </v-dialog>       
    <!-- form + bundling -->

<h1 style="text-align:center;" class="m-4"><v-icon>mdi-tools</v-icon> Baru Proses</h1>


  </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  import Swal from 'sweetalert2'

  export default {
    data() {
      return {
        // form
        loading2:false,
        dialog: false,
        nama: '',
        hargaEcer:null,
        hargaGrosir:null,
        items: [],
        headers:[
            { text: 'Nama', value: 'nama' },
            { text: 'Stok', value: 'stok' },
            { text: 'Harga Ecer', value: 'hargaEcer' },
            { text: 'Harga Grosir', value: 'hargaGrosir' },
            { text: 'Actions', value: 'actions', sortable: false },],   
        
        src:'',
        dialog2:false,
        allItem:[],
        loading: false,
        headers2:[
            { text: 'Nama', value: 'nama' },
            { text: 'Stok', value: 'stok' },
            { text: 'Harga Ecer', value: 'hargaEcer' },
            { text: 'Harga Grosir', value: 'hargaGrosir' },
            { text: 'Actions', value: 'actions', sortable: false },],  
      }
    },
    components: {

    },
    watch: {   
        hargaEcer: function(){
            if(this.hargaEcer){              
                var number_string = this.hargaEcer.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.hargaEcer = sisa ? '.' : '';
                    rupiah += this.hargaEcer + ribuan.join('.');
                }            
    
                this.hargaEcer = rupiah
            }
        },
        hargaGrosir: function(){
            if(this.hargaGrosir){
                var number_string = this.hargaGrosir.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.hargaGrosir = sisa ? '.' : '';
                    rupiah += this.hargaGrosir + ribuan.join('.');
                }            
    
                this.hargaGrosir = rupiah
            }     
        },          
    },
    computed:{
        ...mapGetters({

        }),        
        getRole(){
          return this.$store.state.userRole
        }             
    },    
    methods: { 
        ...mapActions({

        }),               
        batal(){
            this.dialog = false
        },
        getRupiah(uang){
            if(uang){
                var number_string = uang.toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    uang = sisa ? '.' : '';
                    rupiah += uang + ribuan.join('.');
                }            

                return rupiah
            }else{
                return '-'
            }
        },            
        formatRupiahEsc(angka){
            let al = "";
            if(angka=="" || angka==null || angka=="null" || angka==undefined){
                al = "";
            } else {
                al = Math.abs(angka.replace(/[^,\d]/g, '').toString());
            }
            return al;
        },
        search(page){          
          if(this.src === ''){
                this.allItem = []
          } else{     
            this.loading = true      
            axios({
              url: `https://kueku-server-15ecaf79af24.herokuapp.com/item/search2?src=${this.src}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{                   
                        this.allItem = data.results  
                        this.loading = false
                  })
                  .catch(err=>{
                      console.log(err)
                  })        
          }         
        },            
        plusItem(data){
            let flag = true
            this.items.forEach(element => {
                if(element._id === data._id){
                    flag = false
                }
            });
            if(flag){
                this.items.push(data)
            }
        },
        deleteItem(data){
           this.items = this.items.filter(item => String(item._id) !== String(data._id))
        },
        tambahItem(){
                this.loading2 = true
                let temp = {
                        nama: this.nama,
                        hargaEcer:this.formatRupiahEsc(this.hargaEcer),
                        hargaGrosir:this.formatRupiahEsc(this.hargaGrosir),     
                        item: []          
                }   
                this.items.forEach(element => {
                    temp.item.push(element._id)
                });
                axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/bundling`,
                    method: 'post',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:temp
                    })
                    .then(({data}) =>{
                        this.nama = ''
                        this.hargaEcer = null
                        this.hargaGrosir = null
                        this.items = []
                        this.loading2 = false
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