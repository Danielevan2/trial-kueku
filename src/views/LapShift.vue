<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Shift</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
        <v-row class="m-4">
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
                @click.prevent="fetchAllShift()"
                >
                Cari
                </v-btn>                
            </v-col>            
            <v-col
            cols="12"
            sm="4"
            >

            </v-col>
        </v-row>            

        <v-data-table
            :headers="headers1"
            :items="allShift"
            class="elevation-1"
            :items-per-page="10"                              
        >  
            <template v-slot:item.createdAt2="{ item }">
            <p>{{getDate( item.createdAt)}}</p>
            </template>  

            <template v-slot:item.kasir="{ item }">
            <p v-if="item.kasir" >{{item.kasir.username}}</p>
            <p v-if="!item.kasir" >-</p>
            </template>  

            <template v-slot:item.jamMasuk="{ item }">
            <p>{{item.jamKerja.masuk}}</p>
            </template>  

            <template v-slot:item.jamPulang="{ item }">
            <p>{{item.jamKerja.pulang}}</p>
            </template>  

            <template v-slot:item.saldoAwal="{ item }">
            <p>Rp {{getRupiah( item.saldoAwal)}}</p>
            </template>  

            <template v-slot:item.setor="{ item }">
            <p>Rp {{getRupiah( item.setor)}}</p>
            </template>  

            <template v-slot:item.saldoAkhir="{ item }">
            <p>Rp {{getRupiah( item.saldoAkhir)}}</p>
            </template>  
 
             <template v-slot:item.selisih="{ item }">
            <p>Rp {{item.selisih}}</p>
            </template>  

            <template v-slot:item.actions="{ item }">
                <a @click="showKas(item)">
                    <v-chip
                    class="ma-2"
                    color="success"
                    label
                    text-color="white"
                    x-small
                    v-if="!item.status"
                    >
                    Buka
                    </v-chip>                                           
                </a> 
            </template>                                                 
        </v-data-table> 
        
     <!--kas  -->
    <v-dialog
        v-model="dialog"
        max-width="350"
      >
        <b-card no-body>
            <b-tabs card >
                <b-tab title="Kas Keluar" active>
                    <b-card-text>
                        <v-data-table
                        :headers="headers"
                        :items="dataKeluar"
                        class="elevation-1"
                        >
                        <template v-slot:item.jumlah="{ item }">
                        Rp {{ getRupiah(item.jumlah) }}
                        </template>  
                    </v-data-table>                        
                    </b-card-text>
                </b-tab>
                <b-tab title="Kas Masuk">
                    <v-data-table
                        :headers="headers2"
                        :items="dataMasuk"
                        class="elevation-1"
                    >
                        <template v-slot:item.jumlah="{ item }">
                        Rp {{ getRupiah(item.jumlah) }}
                        </template>  
                    </v-data-table>
                </b-tab>
            </b-tabs>
        </b-card>
    </v-dialog>
    <!--kas  -->

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
        tab:true,
        allShift:[],
        headers1:[
            { text: 'Tanggal', value: 'createdAt2'},
            { text: 'Nama Kasir', value: 'kasir' },
            { text: 'Jam Masuk', value: 'jamMasuk' },
            { text: 'Jam Pulang', value: 'jamPulang' },
            { text: 'Saldo Awal', value: 'saldoAwal' },
            { text: 'Setor', value: 'setor' },
            { text: 'Saldo Akhir', value: 'saldoAkhir' },
            { text: 'Selisi', value: 'selisih' },
            { text: 'Kas', value: 'actions', sortable: false },],
        dialog: false,  
        kasKeluar: null,
        kasMasuk: null,
        dataKeluar: [],
        headers:[
            { text: 'Jam', value: 'jam' },
            { text: 'Jumlah', value: 'jumlah'},
            { text: 'Keterangan', value: 'keterangan' },],         
        dataMasuk: [],        
        headers2:[
            { text: 'Jam', value: 'jam' },
            { text: 'Jumlah', value: 'jumlah'},
            { text: 'Keterangan', value: 'keterangan' },],       
        // search
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu1: false,
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu2: false
      }
    },
    components: {
        Billing
    },
    watch: {

    },
    computed:{
        ...mapGetters({

        }),        
        getRole(){
          return this.$store.state.userRole
        },                  
    },    
    methods: { 
        ...mapActions({

        }),    
        fetchAllShift(){
            this.allShift = []
            axios({
                url: `https://kueku-server-15ecaf79af24.herokuapp.com/shift?mulai=${this.date1}&akhir=${this.date2}`,
                method: 'get',
                headers:{
                    token : localStorage.getItem('token')
                }
            })      
                    .then(({data})=>{                             
                        this.allShift = data                        
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
                var number_string = uang.toString().replace(/[^,\d]/g, '')
                
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
                let arr =  str.split('T')
                let arr2 =  arr[1].split('.')
                let arr3 =  arr2[0].split(':')

                return arr3[0]+':'+arr3[1]
            }
        },
        showKas(data){
            console.log(data)
            this.dialog = true
            this.dataKeluar = data.kasKeluar
            this.dataMasuk = data.kasMasuk
        },         
    },
    watch:{

    },
        created(){
            this.fetchAllShift()
    }    
  }
</script>