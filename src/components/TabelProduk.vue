<template>
  <div class="overflow-auto"> 
    <v-text-field
        solo
        label="Search"
        append-icon="mdi-magnify"
        v-on:keyup.enter="search(1)"
        class="mr-4 ml-4"
        clearable
        v-model="src"    
        style="margin-top: 10px;"    
    ></v-text-field>
    
    <v-data-table
        :headers="headers"
        :items="allItem"
        class="elevation-1"
        :loading="loading"
        :per-page="perPage"
    >  

        <template v-slot:item.image="{ item }">
          <img :src="item.image" width="100" height="50"/>
        </template>

        <template v-slot:item.harga="{ item }">
          <p>Rp {{getRupiah( item.harga)}}</p>
        </template>  
     
        <template v-slot:item.actions="{ item }">
            <a @click="formEdit(item)" v-if="getRole === 'super'" class="mr-2">
              <v-icon color="green"  small>mdi-file-document-edit</v-icon>
            </a> 

            <a @click="formEditStokAdmin(item)" v-if="getRole === 'super'" class="mr-2">
              <v-icon color="green" small>mdi-store-edit-outline</v-icon>
            </a>             
                
            <a @click.prevent="deleteItem(item._id)" v-if="getRole === 'super'">
                <v-icon color="red" small>mdi-delete</v-icon>
            </a>  
        </template>    
    </v-data-table>

    <!-- form edit produk -->
    <v-dialog
    v-model="dialog"
    width="1000"      
    >      
    <b-overlay :show="loading2" rounded="sm">
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Edit Produk
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
            @click="dialog = false"
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
    <!-- form edit produk -->   

    <!-- form Edit Nama Produk -->
    <v-dialog
    v-model="dialogNama"
    width="1000"
    >      
      <b-overlay :show="loading2" rounded="sm">    
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Edit Produk
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
                        disabled
                    ></v-text-field>      
                </v-col>
                <v-col cols="12" md="2">                  
                    <v-text-field
                    label="Stok"
                    min="0"
                    v-model="stok"
                    suffix="pcs"
                    type=number
                    v-on:keyup.enter="editStokAdmin()"
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
            @click="dialogNama = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="editStokAdmin()"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
      </b-overlay>
    </v-dialog>       
    <!-- form Edit Nama Produk -->  

    <!-- form edit kode barang -->
    <v-dialog
    v-model="dialog2"
    width="1000"
    >      
      <b-overlay :show="loading2" rounded="sm">    
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Edit Barcode
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="kodeLama"
                        label="Kode Lama"    
                        outlined                        
                        clearable
                        disabled
                    ></v-text-field>      
                </v-col>
            </v-row>            
            <v-row>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="kodeItem"
                        label="Kode Baru"    
                        outlined                        
                        clearable
                        v-on:keyup.enter="editBarcode()"
                    ></v-text-field>      
                </v-col>
            </v-row>         
          </v-container>
          <small>*klik kode baru lalu scan barcode baru</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog2 = false ; kodeItem = ''"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="editBarcode()"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
      </b-overlay>
    </v-dialog>       
    <!-- form edit kode barang -->   
  </div>

</template>

<script>
    import { mapGetters,mapActions,mapMutations } from 'vuex'
    import Swal from 'sweetalert2'
    import axios from 'axios'

  export default {
    data() {
      return {
        perPage: 25,
        allData :[],

        // search
        loading2: false,
        src: '',
        dataSrc: [],
        headers:[            
          { text: 'Gambar', value: 'image' },
          { text: 'Nama', value: 'nama' },
          { text: 'Stok', value: 'stok' },
          { text: 'Harga', value: 'harga' },
          { text: 'Kode Barang', value: 'kodeBarang'},
            { text: 'Actions', value: 'actions', sortable: false },],        

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
        link: '#',

        // edit nama
        dialogNama: false,

        // edit kode
        dialog2: false,
        kodeItem: '',
        kodeLama: ''
      }
    },
    computed:{
        ...mapGetters({
          loading: 'item/getLoading',
          allItem: 'item/getAllItem',
        }),     
        getRole(){
          return this.$store.state.userRole
        }           
    },    
    methods:{     
        ...mapActions({
          fetchItem: 'item/fetchAction',
          }),     
        ...mapMutations({
          fillLoading: 'item/fillLoading'        
        }),                        
        search(page){                
          if(this.src === ''){                
            this.allData = []
          } else{
            this.fillLoading(true)
            this.allData = []
            axios({
              url: `http://localhost:3000/item/search?src=${this.src}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{       
                    this.allData = data.results       
                    this.fillLoading(false)
                  })
                  .catch(err=>{
                      console.log(err)
                  })        
          }         
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

        editOneData(itm){
                let temp = this.allData.findIndex(function(data) {
                  return data._id === itm._id
                })
                this.allData.splice(Number(temp), 1,itm)
        },

        // edit produk
        formEdit(data){
            this.tempId = data._id
            this.nama = data.nama
            this.harga = this.getRupiah(data.harga)
            this.kodeBarang = this.getRupiah(data.kodeBarang)
            this.stok = this.getRupiah(data.stok)
            this.dialog = true
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

      },        
        editItem(){

                if(!this.loading2){             
                  this.loading2 = true
                    axios({
                        url: `http://localhost:3000/item/${this.tempId}`,
                        method: 'put',
                        headers:{
                            token : localStorage.getItem('token')
                        },
                        data:{
                            nama: this.nama,
                            hargaEcer:this.formatRupiahEsc(this.hargaEcer),
                            hargaGrosir:this.formatRupiahEsc(this.hargaGrosir),
                            hargaModal:this.formatRupiahEsc(this.hargaModal)                       
                        }
                        })
                        .then(({data}) =>{                      
                            this.loading2 = false                  
                            this.dialog = false
                            this.editOneData(data)
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

        // edit stok barang
        formEditStokAdmin(item){
          this.dialogNama = true
          this.nama = item.nama
          this.stok = item.stok
          this.tempId = item._id
        },
        editStokAdmin(){
                this.loading2 = true  
                axios({
                    url: `http://localhost:3000/item/editstok/${this.tempId}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        stok: this.stok                     
                    }
                    })
                    .then(({data}) =>{
                        this.loading2 = false                    
                        this.dialogNama = false
                        this.nama = ''   
                        this.stok = 0     
                        this.editOneData(data)
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

        // edit kode barang
        editKode(item){
          this.dialog2 = true
          this.kodeLama = item.kodeBarang
          this.tempId = item._id
        } ,       
        editBarcode(){          
                this.loading2 = true  
                axios({
                    url: `http://localhost:3000/item/editkode/${this.tempId}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        kodeBarang: this.kodeItem,                    
                    }
                    })
                    .then(({data}) =>{
                        this.loading2 = false                    
                        this.dialog2 = false
                        this.kodeLama = ''
                        this.kodeItem = ''
                        this.editOneData(data)       
                    })
                    .catch(err=>{
                            this.loading2 = false                  
                            if(err.response.status === 401){
                              Swal.fire({
                                icon: 'error',
                                title: 'kode sudah terdaftar !',
                                text: err.errors,
                              })
                            }else{
                              Swal.fire({
                                icon: 'error',
                                title: 'gagal !',
                                text: err.errors,
                                }) 
                            }
                         
                    }) 
        },
        deleteItem(id){
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
                        url: `http://localhost:3000/item/${id}`,
                        method: 'delete',
                        headers:{
                            token : localStorage.getItem('token')
                        }
                        })
                        .then((respone) =>{
                            this.fetchItem(1,10)
                            // if(this.src !== ''){
                            //   this.search()
                            // }else{
                            //   this.allData = []      
                            // }
                            Swal.fire('deleted!', '', 'success')
                        })                   
                    }
                })            
        }         
    },
    watch:{
        src: function(){
          if(this.src === ''){
            this.allData = []
          }
        },
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
        hargaModal: function(){
            if(this.hargaModal){
                var number_string = this.hargaModal.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.hargaModal = sisa ? '.' : '';
                    rupiah += this.hargaModal + ribuan.join('.');
                }            
    
                this.hargaModal = rupiah
            }            
            if(this.rumus === '10/5'){
              let ecer = 10/100
              let grosir = 5/100              
              let potEcer = this.formatRupiahEsc(this.hargaModal) * ecer
              let potGrosir = this.formatRupiahEsc(this.hargaModal) * grosir              
              this.tempHargaEcer = this.formatRupiahEsc(this.hargaModal) + potEcer
              this.tempHargaGrosir = this.formatRupiahEsc(this.hargaModal) + potGrosir              
            }else if(this.rumus === '8/3'){
              let ecer2 = 8/100
              let grosir2 = 3/100              
              let potEcer2 = this.formatRupiahEsc(this.hargaModal) * ecer2
              let potGrosir2 = this.formatRupiahEsc(this.hargaModal) * grosir2 
              this.tempHargaEcer = this.formatRupiahEsc(this.hargaModal) + potEcer2
              this.tempHargaGrosir = this.formatRupiahEsc(this.hargaModal) + potGrosir2   
            }else if(this.rumus === '200/150'){
              let Ecer3 = 200/100
              let Grosir3 = 150/100              
              this.tempHargaEcer = this.formatRupiahEsc(this.hargaModal) * Ecer3
              this.tempHargaGrosir = this.formatRupiahEsc(this.hargaModal) * Grosir3 
            }else if(this.rumus === '150/120'){
              let Ecer4 = 150/100
              let Grosir4 = 120/100              
              this.tempHargaEcer = this.formatRupiahEsc(this.hargaModal) * Ecer4
              this.tempHargaGrosir = this.formatRupiahEsc(this.hargaModal) * Grosir4    
            }
        },
        rumus: function(){
            if(this.rumus === '10/5'){
              let ecer = 10/100
              let grosir = 5/100              
              let potEcer = this.formatRupiahEsc(this.hargaModal) * ecer
              let potGrosir = this.formatRupiahEsc(this.hargaModal) * grosir              
              this.tempHargaEcer = this.formatRupiahEsc(this.hargaModal) + potEcer
              this.tempHargaGrosir = this.formatRupiahEsc(this.hargaModal) + potGrosir              
            }else if(this.rumus === '8/3'){
              let ecer2 = 8/100
              let grosir2 = 3/100              
              let potEcer2 = this.formatRupiahEsc(this.hargaModal) * ecer2
              let potGrosir2 = this.formatRupiahEsc(this.hargaModal) * grosir2 
              this.tempHargaEcer = this.formatRupiahEsc(this.hargaModal) + potEcer2
              this.tempHargaGrosir = this.formatRupiahEsc(this.hargaModal) + potGrosir2   
            }else if(this.rumus === '200/150'){
              let Ecer3 = 200/100
              let Grosir3 = 150/100              
              this.tempHargaEcer = this.formatRupiahEsc(this.hargaModal) * Ecer3
              this.tempHargaGrosir = this.formatRupiahEsc(this.hargaModal) * Grosir3 
            }else if(this.rumus === '150/120'){
              let Ecer4 = 150/100
              let Grosir4 = 120/100              
              this.tempHargaEcer = this.formatRupiahEsc(this.hargaModal) * Ecer4
              this.tempHargaGrosir = this.formatRupiahEsc(this.hargaModal) * Grosir4    
            }
        }                           
    },
    created(){

    }
  }
</script>