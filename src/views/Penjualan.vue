<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5" v-if="!print">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Penjualan Hari Ini</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
                <v-data-table
                    :headers="headers"
                    :items="allPenjualan"
                    class="elevation-1"
                    :items-per-page="10"      
                    v-if="!print"                        
                >  
                    <template v-slot:item.totalHarga="{ item }">
                    <p>Rp {{getRupiah( item.totalHarga)}}</p>
                    </template>   

                    <template v-slot:item.actions="{ item }">
                        <a @click="showItem(item.listItem)">
                            <v-icon color="green" v-b-popover.hover.top="'All Item'" dense>mdi-basket-outline</v-icon>
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
            { text: 'Jam', value: 'jam'},
            { text: 'Total Harga', value: 'totalHarga' },
            { text: 'Pembayaran', value: 'pembayaran' },
            { text: 'List Barang', value: 'actions', sortable: false },  
            { text: 'Action', value: 'actions2', sortable: false },],
        dialog: false,
        fields:['Item','Qty','Harga','Total'],
        items: [],        
      }
    },
    components: {
        Billing
    },
    watch: {

    },
    computed:{
        ...mapGetters({
            data: 'shift/getData',
            print: 'transaksi/getPrint',
        }),        
        getRole(){
          return this.$store.state.userRole
        }             
    },    
    methods: { 
        ...mapActions({
            fetchShift: 'shift/getDataShift',
            printBill: 'transaksi/printBill'
        }),               
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
            this.items = data
            this.dialog = true
        },
           
    },
    watch:{
        data: function(){
            if(this.data !== null){
                this.allPenjualan = this.data.transaksi.reverse()
            }
        }
    },
    created(){
        this.fetchShift()
    }    
  }
</script>