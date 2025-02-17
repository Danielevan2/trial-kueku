<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Shift</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
    <v-stepper
        v-model="e13"
        vertical
    >
        <!-- MULAI SHIFT -->    
        <v-stepper-step
        step="1"
        complete
        >
        Mulai Shift
        </v-stepper-step>

        <v-stepper-content step="1">

            <v-row>
                <v-col cols="12" md="5">      
                    <v-text-field
                    class="m-5"
                    label="Saldo Awal"
                    v-model="saldoAwal"
                    prefix="Rp"       
                    persistent-hint
                    hint="*isi jumlah uang awal yang ada dikasir"        
                    v-on:keyup.enter="openPin()" 
                    ></v-text-field>     
                </v-col>
            </v-row> 

            <v-btn
                color="primary"
                @click="openPin()"
                class="mt-2"
            >
                Mulai
            </v-btn>
        </v-stepper-content>
        <!-- MULAI SHIFT -->

        <!-- KAS MASUK / KAS KELUAR -->
        <v-stepper-step
        step="2"
        complete
        >
        Kas Masuk / Kas Keluar
        </v-stepper-step>

        <v-stepper-content step="2">
            <v-card>
            <!-- <v-tabs color="red accent-4" right>
                <v-tab v-model="kasKeluar">Kas Keluar</v-tab>
                <v-tab v-model="kasMasuk">Kas Masuk</v-tab>

                
                <v-tab-item v-model="kasKeluar">
                    <Keluar />
                </v-tab-item>
                
                <v-tab-item v-model="kasMasuk">

                    <Masuk />

                </v-tab-item>
                

            </v-tabs> -->

            <b-tabs card >
                <b-tab title="Kas Keluar" active>
                    <b-card-text>
                        <Keluar />                       
                    </b-card-text>
                </b-tab>
                <b-tab title="Kas Masuk">
                        <Masuk />
                </b-tab>
            </b-tabs>            
            </v-card>
        <v-btn
            color="primary"
            @click="e13 = 3"
            class="mt-3"
        >
            Akhiri Shift
        </v-btn>
        </v-stepper-content>
        <!-- KAS MASUK / KAS KELUAR -->

        <!-- AKHIRI SHIFT -->
        <v-stepper-step step="3">
        Akhiri Shift
        </v-stepper-step>

        <v-stepper-content step="3">
            <v-row>
                <v-col cols="12" md="7">      
                    <v-text-field
                    class="m-5"
                    label="Setor"
                    v-model="setor"
                    prefix="Rp"       
                    persistent-hint
                    hint="*isi jumlah uang yang disetor"        
                    v-on:keyup.enter="akhiriShift()" 
                    outlined
                    ></v-text-field>     
                </v-col>
                <v-col cols="12" md="5">
                    <h2>Total Transaksi Tunai :                     
                    <v-chip
                        class="ma-2"
                        color="green"
                        text-color="white"
                        >
                        Rp {{getRupiah(totalTransaksiTunai)}}
                    </v-chip>   
                    </h2>  
                </v-col>            
            </v-row>
            <hr>             
            <v-row>
                <v-col cols="12" md="7">      
                    <v-text-field
                    class="m-5"
                    :label="`Saldo Akhir: Rp ${saldo}`"
                    v-model="saldoAkhir"
                    prefix="Rp"       
                    persistent-hint                        
                    v-on:keyup.enter="akhiriShift()" 
                    hint="*isi jumlah uang setelah setor"
                    outlined
                    ></v-text-field>     
                </v-col>
                <v-col cols="12" md="5">      
                    <h2>Selisih :
                    <v-chip
                        class="ma-2"
                        outlined
                        pill                    
                        v-if="selisih === 0"
                        >
                        <v-icon small>mdi-checkbox-marked-circle-outline</v-icon>
                    </v-chip>                       
                    <v-chip
                        class="ma-2"
                        color="green"
                        text-color="white"
                        v-if="selisih > 0"
                        >
                        Rp {{getRupiah(selisih)}}
                    </v-chip>
                    <v-chip
                        class="ma-2"
                        color="red"
                        text-color="white"
                        v-if="selisih < 0"
                        >
                        Rp {{getRupiah(selisih)}}
                    </v-chip>    
                    </h2>    
                </v-col>
            </v-row> 
            

            <v-btn
                color="primary"
                @click="akhiriShift()"
            >
                Akhiri
            </v-btn>
            <v-btn @click="e13 = 2" text>
                Edit Kas
            </v-btn>            
        </v-stepper-content>
        <!-- AKHIRI SHIFT -->   
    </v-stepper>    

        <!-- form input pin -->
        <v-dialog
        v-model="dialog2"
        width="500">
        <v-card>
            <v-card-title class="text-h5 grey lighten-2 mb-4">
            Input Barcode :
            </v-card-title>
            <v-card-text>
            <v-container>
                <v-row style="display: flex;justify-content: center;">
                    <v-col cols="12" md="12" style="display: flex;justify-content: center;">   
                        <v-text-field
                            solo
                            label="Scan Barcode"
                            v-on:keyup.enter="mulaiShift()"
                            class="mr-4 ml-4"
                            clearable
                            v-model="pin"
                        ></v-text-field>    
                    </v-col>           
                </v-row>            
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="dialog2 = false"
            >
                Batal
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="mulaiShift()"
                v-on:keyup.alt.enter="mulaiShift()"
            >
                mulai
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    <!-- form input pin -->


  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  import Keluar from '../components/KasKeluar.vue'
  import Masuk from '../components/KasMasuk.vue'


  export default {
    data() {
      return {
        e13: 1,
        kasKeluar: null,
        kasMasuk: null,
        saldoAwal: null,
        setor: null,
        saldoAkhir: null,
        totalTransaksiTunai:0,

        dialog2:false,
        pin:''
      }
    },
    components: {
        Keluar,
        Masuk
    },
    computed:{
        ...mapGetters({
            shift: 'shift/getShift',
            data: 'shift/getData'
        }),       
        saldo: function(){
            if(this.data !== null){
                let totalTransaksi = 0
                this.totalTransaksiTunai = 0
                this.data.transaksi.forEach(element => {
                    if(element.pembayaran === 'Tunai' && element.status === true){
                        totalTransaksi += element.totalHarga
                        this.totalTransaksiTunai += element.totalHarga
                    }
                });
    
                let totalKasKeluar = 0
                this.data.kasKeluar.forEach(element => {
                    totalKasKeluar += element.jumlah
                });
                
                let totalKasMasuk = 0
                this.data.kasMasuk.forEach(element => {
                    totalKasMasuk += element.jumlah
                });            
    
                let num = Number(this.data.saldoAwal) + Number(totalKasMasuk) + Number(totalTransaksi) - Number(totalKasKeluar) - this.formatRupiahEsc(this.setor)
    
    
                var number_string = num.toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    num = sisa ? '.' : '';
                    rupiah += num + ribuan.join('.');
                }            
          
                return rupiah
            }else{
                return '0'
            }
        },
        selisih: function(){
                return this.formatRupiahEsc(this.saldoAkhir) - this.formatRupiahEsc(this.saldo)
        }
    },    
    watch: {
        data: function(){
            if(this.data === null){
                this.e13 = 1           
            }else{
                this.e13 = 2
            }
        },
        saldoAwal: function(){
            if(this.saldoAwal){
                var number_string = this.saldoAwal.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.saldoAwal = sisa ? '.' : '';
                    rupiah += this.saldoAwal + ribuan.join('.');
                }            
    
                this.saldoAwal = rupiah
            }
        },    
        setor: function(){
            if(this.setor){
                var number_string = this.setor.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.setor = sisa ? '.' : '';
                    rupiah += this.setor + ribuan.join('.');
                }            
    
                this.setor = rupiah
            }
        },  
        saldoAkhir: function(){
            if(this.saldoAkhir){
                var number_string = this.saldoAkhir.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.saldoAkhir = sisa ? '.' : '';
                    rupiah += this.saldoAkhir + ribuan.join('.');
                }            
    
                this.saldoAkhir = rupiah
            }
        }          
    },    
    methods: { 
        ...mapActions({
            fetchShift: 'shift/getDataShift'
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
        openPin(){
            this.pin = ''
            this.dialog2 = true
        },            
        mulaiShift(){
                Swal.fire({
                    title: 'Apakah anda yakin akan memulai shift?',
                    showDenyButton: true,
                    confirmButtonText: `ya`,
                    denyButtonText: `Batal`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios({
                            url: `https://kueku-server-15ecaf79af24.herokuapp.com/shift/kasir/mulai`,
                            method: 'post',
                            headers:{
                                token : this.pin
                            },
                            data:{
                                saldoAwal:this.formatRupiahEsc(this.saldoAwal)
                            }
                        })      
                                .then(({data})=>{         
                                    this.fetchShift()
                                    this.e13 = 2
                                    this.dialog2 = false
                                })
                                .catch(err=>{
                                    if(err.response.status === 401){
                                        console.log(err.response.status)
                                        Swal.fire({
                                        icon: 'error',
                                        title: 'anda sudah memulai shift (reload web) !',
                                        text: err.errors,
                                        })
                                    } else if(err.response.status === 400){
                                        console.log(err.response.status)
                                        Swal.fire({
                                        icon: 'error',
                                        title: 'saldo awal tidak sesuai !',
                                        text: err.errors,
                                        })
                                    } else if(err.response.status === 404){
                                        console.log(err.response.status)
                                        Swal.fire({
                                        icon: 'error',
                                        title: 'pin salah !',
                                        text: err.errors,
                                        })
                                    }
                                })                            
                    } else if (result.isDenied) {

                    }
                })             
        },
        akhiriShift(){
                Swal.fire({
                    title: 'Apakah anda yakin akan akhiri shift?',
                    showDenyButton: true,
                    confirmButtonText: `ya`,
                    denyButtonText: `Batal`,
                    }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        axios({
                            url: `https://kueku-server-15ecaf79af24.herokuapp.com/shift/kasir/selesai`,
                            method: 'put',
                            headers:{
                                token : localStorage.getItem('token')
                            },
                            data:{
                                id: this.data._id,
                                setor: this.formatRupiahEsc(this.setor),
                                saldoAkhir: this.formatRupiahEsc(this.saldoAkhir),
                                selisih: Number(this.selisih)
                            }
                        })      
                                .then(({data})=>{      
                                    this.fetchShift()
                                    this.e13 = 1
                                })
                                .catch(err=>{
                                    console.log(err)
                                })                            
                    } else if (result.isDenied) {

                    }
                })             

        }                          
    },
    created(){    
        this.fetchShift()
    }     
  }
</script>