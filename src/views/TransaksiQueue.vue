<template>
    <div>
      <v-card max-width="auto" tile flat class="my-5">
        <v-toolbar color="" flat height="60px" >
        <v-spacer></v-spacer>
          <h2>Antrian Transaksi</h2>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-card>
        <v-data-table
            :headers="headers"
            :items="data"
            class="elevation-1"
            :items-per-page="10"                             
        >  
            <template v-slot:item.index="{ item, index }">
                <p>{{index + 1}}</p>
            </template> 

            <template v-slot:item.totalHarga="{ item }">
            <p>Rp {{getRupiah( item.total)}}</p>
            </template>   

            <template v-slot:item.actions="{ item }">
                <a @click="showItem(item.listItem)">
                    <v-icon color="green" v-b-popover.hover.top="'All Item'" dense>mdi-basket-outline</v-icon>
                </a> 
            </template>      

            <template v-slot:item.actions2="{ item , index }">
                <a @click="lanjutkanAntrian(index)">
                        <v-chip
                        class="ma-2"
                        color="cyan"
                        label
                        text-color="white"
                        x-small
                        >
                        Lanjutkan
                        </v-chip>
                </a>                                              
            </template>                                             
        </v-data-table> 
       
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
                        <p v-if="Number(row.item.qty) < 3">Rp {{ getRupiah(row.item.hargaEcer)  }}</p>
                        <p v-if="Number(row.item.qty) >= 3">Rp {{ getRupiah(getHargaGrosir(row.item))  }}</p>
                    </template>           
                    <template #cell(Total)="row">
                    <p v-if="Number(row.item.qty) < 3">Rp {{ getRupiah(row.item.hargaEcer * row.item.qty) }}</p>
                    <p v-if="Number(row.item.qty) >= 3">Rp {{ getRupiah(getTotalHargaGrosir(row.item)) }}</p>
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
              { text: 'No', value: 'index'},
              { text: 'Total Harga', value: 'totalHarga' },
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
              data: 'transaksi/getAntrian'
          }),        
          getRole(){
            return this.$store.state.userRole
          }             
      },    
      methods: { 
          ...mapActions({
              lanjutkanAntrian: 'transaksi/lanjutkanAntrian'
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
          }             
      },
      created(){

      }    
    }
  </script>