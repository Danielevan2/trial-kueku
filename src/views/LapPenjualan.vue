<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5" v-if="!print">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Penjualan</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
        <v-row class="m-4" v-if="!print">
            <v-col
            cols="12"
            sm="4"
            >
            <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="date1"
                    label="Tanggal Mulai"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker
                v-model="date1"
                @input="menu1 = false"
                ></v-date-picker>
            </v-menu>
            </v-col>            
            <v-col
            cols="12"
            sm="4"
            >
                <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="date2"
                        label="Tanggal Akhir"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                    v-model="date2"
                    @input="menu2 = false"
                    ></v-date-picker>
                </v-menu>
                <v-btn
                rounded
                color="primary"
                small
                dark
                class="float-right"
                @click.prevent="fetchAllPenjualan()"
                >
                Cari
                </v-btn>                
            </v-col>            
            <v-col
            cols="12"
            sm="4"
            >
                <v-text-field
                    solo
                    label="Search By Kode Barang"
                    append-icon="mdi-magnify"
                    v-on:keyup.enter="search(1)"
                    class="mr-4 ml-4"
                    clearable
                    v-model="src"        
                ></v-text-field>                
            </v-col>
        </v-row>            

        <v-row class="m-4" v-if="!print">
            <v-col cols="12" sm="3">
               <h1> Total Transaksi </h1>
               <h1 class="grey--text">{{allPenjualan.length}}</h1>
            </v-col>
            <v-col cols="12" sm="3" v-if="src === ''">
               <h1> Total Penjualan(tunai) </h1>
               <h1 class="grey--text">Rp {{getRupiah(totalPenjualanTunai)}}</h1>
            </v-col>     
            <v-col cols="12" sm="3" v-if="src === ''">
               <h1> Total Penjualan(bank) </h1>
               <h1 class="grey--text">Rp {{getRupiah(totalPenjualanBank)}}</h1>
            </v-col>       
            <v-col cols="12" sm="4" v-if="src !== ''">
               <h1> Total Barang Terjual </h1>
               <h1 class="grey--text">{{terjual}}</h1>
            </v-col>  
            <v-col cols="12" sm="3" v-if="src === ''">
               <h1> Total Diskon </h1>
               <h1 class="grey--text">Rp {{getRupiah(totalDiskon)}}</h1>
            </v-col>                                                                         
        </v-row>

        <v-data-table
            :headers="headers"
            :items="allPenjualan"
            class="elevation-1"
            :items-per-page="15"
            :footer-props="{'items-per-page-options':[20, 50, 80, -1]}"      
            v-if="!print"        
            :loading="loading"                
        >  
            <template v-slot:item.createdAt2="{ item }">
            <p>{{getDate( item.createdAt)}}</p>
            </template>     
  
            <template v-slot:item.kasir="{ item }">
            <p v-if="item.kasir">{{item.kasir.username}}</p>
            <p v-if="!item.kasir">-</p>
            </template>  

            <template v-slot:item.diskon="{ item }">
            <p v-if="item.diskon">Rp {{getRupiah( item.diskon)}}</p>
            <p v-if="!item.diskon || item.diskon > 0">-</p>
            </template>  

            <template v-slot:item.totalHarga="{ item }">
            <p>Rp {{getRupiah( item.totalHarga)}}</p>
            </template>  
 

            <template v-slot:item.actions="{ item }">
                <a @click="showItem(item)">
                    <v-icon color="green" dense>mdi-basket-outline</v-icon>
                </a> 
            </template>      

            <template v-slot:item.actions2="{ item }">
                <a @click="printBill(item)" v-if="item.status">
                        <v-chip
                        class="ma-2"
                        color="cyan"
                        label
                        text-color="white"
                        x-small
                        >
                        Print
                        </v-chip>
                </a>  
                <a @click="batalTransaksi(item._id)" v-if="item.status">
                        <v-chip
                        class="ma-2"
                        color="pink"
                        label
                        text-color="white"
                        x-small
                        >
                        Batal
                        </v-chip>
                </a>                          
                <v-chip
                class="ma-2"
                color="red"
                label
                text-color="white"
                x-small
                v-if="!item.status"
                >
                Transaksi Dibatalkan
                </v-chip>                                  
            </template>                                             
        </v-data-table> 

     
     <Billing v-if="print" />

     <!--all item list  -->
    <v-dialog
        v-model="dialog"
        max-width="350"
      >
        <v-card>
            <b-table
            id="my-table"
            :items="items"
            :fields="fields"
            small
            hover
            >
                <template #cell(KodeBarang)="row">
                    <span class="mr-auto">{{row.item.kodeBarang}}</span>            
                </template>                
                <template #cell(Item)="row">
                    <span class="mr-auto">{{row.item.nama}}</span>            
                </template>      
                <template #cell(Qty)="row">
                <p>{{ row.item.qty}}</p>
                </template>     
                <template #cell(Harga)="row">
                    <p>Rp {{ getRupiah(row.item.harga)  }}</p>
                </template>           
                <template #cell(Total)="row">
                    <p>Rp {{ getRupiah(row.item.harga * row.item.qty) }}</p>
                </template>    
                <template #cell(Refund)="row">
                    <a @click="refund(row.item)">
                        <v-icon color="green" v-b-popover.hover.top="'Refund Item'" dense>mdi-restore-alert</v-icon>
                    </a> 
                </template>                                                                    
            </b-table>                            
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              Cancel
            </v-btn>
        </v-card>
    </v-dialog>
    <!--all item list  -->


    <!-- form refund -->
    <v-dialog
      v-model="dialog2"
      scrollable
      max-width="300px"
    >
      <v-card>
        <v-card-title>Jumlah Refund</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-text-field
                    label="Stok"
                    min="0"
                    v-model="jumlahRefund"
                    suffix="pcs"
                    type=number                
                    v-on:keyup.enter="(refundItem())"                                           
            ></v-text-field>       
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog2 = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="refundItem()"
          >
            Refund
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- form Item -->

    <!-- loading -->
    <v-dialog
      v-model="loading2"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Loading
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>   
    <!-- loading -->

  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  import Billing from '../components/Billing2.vue'
  

  export default {
    data() {
      return {
        hariIni: null,
        semua: null,
        allPenjualan:[],
        headers:[
            { text: 'Tanggal', value: 'createdAt2'},
            { text: 'Jam', value: 'jam'},
            { text: 'Kasir', value: 'kasir'},
            { text: 'Diskon', value: 'diskon'},
            { text: 'Total Harga', value: 'totalHarga' },
            { text: 'Pembayaran', value: 'pembayaran' },
            { text: 'List Barang', value: 'actions', sortable: false },  
            { text: 'Action', value: 'actions2', sortable: false },],

        dialog: false,
        fields:['KodeBarang','Item','Qty','Harga','Total','Refund'],
        items: [],    
        tempIdTransaksi: "",

        // refund
        dialog2: false,
        tempKode:"",
        jumlahRefund:0,
        loading2: false,

        // search
        loading:false,
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu1: false,
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu2: false,
        src:'',
        terjual:0
      }
    },
    components: {
        Billing
    },
    watch: {

    },
    computed:{
        ...mapGetters({
            print: 'transaksi/getPrint',
        }),        
        getRole(){
          return this.$store.state.userRole
        }, 
        totalPenjualanTunai(){
            if(this.allPenjualan.length > 0){
                let temp = 0
                let totalPenjualanBank = 0

                this.allPenjualan.forEach(element => {
                    if(element.pembayaran === 'Tunai' && element.status === true){
                        temp += element.totalHarga
                    }else if(element.pembayaran === 'Bank' && element.status === true){
                        totalPenjualanBank += element.totalHarga
                    }
                });

                return temp
            }             
        },
        totalPenjualanBank(){
            if(this.allPenjualan.length > 0){
                let temp = 0

                this.allPenjualan.forEach(element => {
                     if(element.pembayaran === 'Bank' && element.status === true){
                        temp += element.totalHarga
                    }
                });

                return temp
            }                  
        },
        totalDiskon(){
            if(this.allPenjualan.length > 0){
                let tempDiskon = 0

                this.allPenjualan.forEach(element => {
                    if(element.diskon || element.diskon > 0){
                        tempDiskon += element.diskon
                    }
                });

                return tempDiskon
            }
        }                   
    },    
    methods: { 
        ...mapActions({
            printBill: 'transaksi/printBill'
        }),    
        search(page){      
          this.loading = true
          this.allPenjualan = []
          this.terjual = 0
          if(this.src === ''){
                this.fetchAllPenjualan()
          } else{        
            this.allPenjualan
            axios({
              url: `https://kueku-server-15ecaf79af24.herokuapp.com/transaksi/by?kode=${this.src}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{     
                data.forEach(element => {
                    element.listItem.forEach(element2 =>{
                        if(element2.kodeBarang === this.src){
                            this.terjual += element2.qty
                        }
                    })
                });                                                                    
                    this.allPenjualan = data
                    this.loading = false
                  })
                  .catch(err=>{
                      console.log(err)
                  })        
          }         
        },         
        fetchAllPenjualan(){
            console.log(this.date1)
            this.src = ''
            this.allPenjualan = []
            this.loading = true
            axios({
                url: `https://kueku-server-15ecaf79af24.herokuapp.com/transaksi?mulai=${this.date1}&akhir=${this.date2}`,
                method: 'get',
                headers:{
                    token : localStorage.getItem('token')
                }
            })      
                    .then(({data})=>{                         
                        this.allPenjualan = data
                        this.loading = false
                    })
                    .catch(err=>{
                        console.log(err)
                    })            
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
        getDate(str){
            if(str){
                let arr =  str.split('T')

                return arr[0]
            }
        },        
        getTime(str){
            if(str){
                let arr = ''
                if(str.includes('T') === true){
                    arr =  str.split('T')
                }else{
                    arr =  str.split(',')
                }
                let arr2 =  arr[1].split('.')
                let arr3 =  arr2[0].split(':')

                return arr3[0]+':'+arr3[1]
            }
        },
        showItem(data){
            this.items = data.listItem
            this.tempIdTransaksi = data._id
            this.dialog = true
        },       
        batalTransaksi(id){
                Swal.fire({
                    title: 'Apakah anda yakin akan batalkan transaksi?',
                    showDenyButton: true,
                    confirmButtonText: `Batal`,
                    denyButtonText: `Ya,Batalkan`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                            
                    } else if (result.isDenied) {
                        axios({
                        url: `https://kueku-server-15ecaf79af24.herokuapp.com/transaksi/batal/${id}`,
                        method: 'put',
                        headers:{
                            token : localStorage.getItem('token')
                        }
                        })
                        .then((respone) =>{
                            this.fetchShift()
                            Swal.fire('deleted!', '', 'success')
                        })                   
                    }
                })             
        },
        refund(item){
            this.jumlahRefund = item.qty
            this.tempKode = item.kodeBarang
            this.dialog2 = true
        },
        refundItem(){
            this.dialog = false
            this.loading2 = true
            axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/transaksi/refund/${this.tempIdTransaksi}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        kodeBarang : this.tempKode,
                        jumlah: this.jumlahRefund
                    }
                    })
                    .then(({data}) =>{
                        this.dialog2 = false
                        this.loading2 = false
                        this.fetchAllPenjualan()
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
        }           
    },
    watch:{

    },
        created(){
            this.fetchAllPenjualan()
    }    
  }
</script>