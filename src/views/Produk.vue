<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Produk</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
    <v-btn v-if="getRole === 'super'" class="m-3" @click.prevent="dialog = true">+ Tambah Produk</v-btn>

    <!-- form + produk -->
    <v-dialog
    v-model="dialog"
    width="1000"      
    >      
    <b-overlay :show="loading2" rounded="sm">
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Tambah Produk
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="nama"
                        label="Nama Barang"    
                        outlined                        
                        clearable
                        v-on:keyup.alt="tambahItem()"
                    ></v-text-field>      
                </v-col>
                <v-col cols="12" md="2">                  
                    <v-text-field
                    label="Stok"
                    min="0"
                    v-model="stok"
                    suffix="pcs"
                    type=number                
                    v-on:keyup.alt="tambahItem()"                                           
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row v-if="getRole === 'super'">
                <v-col cols="6" md="6">                  
                    <v-text-field
                    label="Harga"
                    v-model="harga"
                    prefix="Rp"                
                    v-on:keyup.alt="tambahItem()"                                         
                    ></v-text-field>
                </v-col>    
                <v-col cols="6" md="6">
                    <v-text-field
                        v-model="kodeBarang"
                        label="Kode Barang"    
                        outlined                        
                        clearable
                        v-on:keyup.alt="tambahItem()"
                    ></v-text-field>      
                </v-col>                                   
            </v-row>      

            <!-- foto -->
            <v-row>
                <div id="app" class="web-camera-container">
                    <div class="camera-button">
                        <button type="button" class="button is-rounded" :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
                            <span v-if="!isCameraOpen">Open Camera</span>
                            <span v-else>Close Camera</span>
                        </button>
                    </div>
                    
                    <div v-show="isCameraOpen && isLoading" class="camera-loading">
                        <ul class="loader-circle">
                        <li></li>
                        <li></li>
                        <li></li>
                        </ul>
                    </div>
                    
                    <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">
                        
                        <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
                        
                        <video v-show="!isPhotoTaken" ref="camera" :width="450" :height="337.5" autoplay></video>
                        
                        <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="450" :height="337.5"></canvas>
                    </div>
                    
                    <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
                        <v-btn type="button" class="button" @click="takePhoto">
                          capture
                        </v-btn>
                    </div>

                    </div>
            </v-row>
            <!-- foto -->              
          </v-container>
          <br>
          <small>*kode barang jangan diisi jika tidak ada barcode</small>
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
            @click="tambahItem()"
          >
            Tambah
          </v-btn>
        </v-card-actions>
      </v-card>
    </b-overlay>
    </v-dialog>       
    <!-- form + produk -->

    <Tabel />

  </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  import Tabel from '../components/TabelProduk.vue'

  export default {
    data() {
      return {
        // form
        loading2:false,
        dialog: false,
        nama: '',
        stok:0,
        harga:null,
        kodeBarang: '',
            // foto
            isCameraOpen: false,
            isPhotoTaken: false,
            isShotPhoto: false,
            isLoading: false,
            link: '#'
      }
    },
    components: {
        Tabel
    },
    watch: {   
      harga: function(){
                if(this.harga){
                var number_string = this.harga.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.harga = sisa ? '.' : '';
                    rupiah += this.harga + ribuan.join('.');
                }            
    
                this.harga = rupiah
                } 
            },
    },
    computed:{
        ...mapGetters({
          allItem: 'item/getAllItem',
          totalItem: 'item/getTotalItem',
          loading: 'item/getLoading'
        }),        
        getRole(){
          return this.$store.state.userRole
        }             
    },    
    methods: { 
        ...mapActions({
         fetchItem: 'item/fetchAction',
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
        }      ,  
        tambahItem(){
                this.loading2 = true
                let temp = {
                        nama: this.nama,
                        stok:this.stok,
                        harga:this.formatRupiahEsc(this.harga),     
                        image: this.link
                }
                if(this.kodeBarang !== ''){
                  temp.kodeBarang = this.kodeBarang
                }else{
                  temp.kodeBarang = '-'
                }       
                axios({
                    url: `http://localhost:3000/item`,
                    method: 'post',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:temp
                    })
                    .then(({data}) =>{
                        this.kodeBarang = ''
                        this.nama = ''
                        this.stok = 0
                        this.harga = null
                        this.loading2 = false
                        this.toggleCamera()
                        this.fetchItem(1,10)
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
        // foto
        toggleCamera() {
            this.link = '#'
            if(this.isCameraOpen) {
                this.isCameraOpen = false;
                this.isPhotoTaken = false;
                this.isShotPhoto = false;
                this.stopCameraStream();
            } else {
                this.isCameraOpen = true;
                this.createCameraElement();
            }
        },
    
        createCameraElement() {
            this.isLoading = true;
            
            const constraints = (window.constraints = {
                        audio: false,
                        video: true
                    });


                    navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then(stream => {
                this.isLoading = false;
                            this.$refs.camera.srcObject = stream;
                        })
                        .catch(error => {
                this.isLoading = false;
                            alert("May the browser didn't support or there is some errors.");
                        });
            },
            
        stopCameraStream() {
            let tracks = this.$refs.camera.srcObject.getTracks();

                    tracks.forEach(track => {
                        track.stop();
                    });
            },
    
        takePhoto() {
            if(!this.isPhotoTaken) {
                this.isShotPhoto = true;

                const FLASH_TIMEOUT = 50;

                setTimeout(() => {
                this.isShotPhoto = false;
                }, FLASH_TIMEOUT);
            }
            
            this.isPhotoTaken = !this.isPhotoTaken;
            
            const context = this.$refs.canvas.getContext('2d');
            context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
            
            const canvas = document.getElementById("photoTaken").toDataURL()
           
            this.link = canvas

      }
    },
    created(){
        this.fetchItem(1,10)
      }
  }
</script>