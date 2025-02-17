<template>
  <div class="overflow-auto"> 
    <v-btn class="m-3" @click.prevent="dialog = true">+ Kas Masuk</v-btn>   

    <!-- form + Kas Masuk -->
    <v-dialog
    v-model="dialog"
    width="1000"      
    >      
    <b-overlay :show="loading2" rounded="sm">
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Tambah Kas Masuk
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" md="10">
                        <v-text-field
                        label="Jumlah Uang"
                        v-model="jumlah"
                        prefix="Rp"              
                        v-on:keyup.enter="tambahKas()"                                             
                        ></v-text-field>
                </v-col>
            </v-row>     
            <v-row>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="keterangan"
                        label="Keterangan"    
                        outlined                        
                        clearable
                        v-on:keyup.enter="tambahKas()"
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
            @click="dialog = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="tambahKas()"
          >
            Tambah
          </v-btn>
        </v-card-actions>
      </v-card>
    </b-overlay>
    </v-dialog>       
    <!-- form + Kas Masuk -->

    <v-data-table
        :headers="headers"
        :items="kasMasuk"
        class="elevation-1"
        :loading="loading2"
    >
        <template v-slot:item.jumlah="{ item }">
        Rp {{ getRp(item.jumlah) }}
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

  </div>

</template>

<script>
    import { mapGetters,mapActions,mapMutations } from 'vuex'
    import Swal from 'sweetalert2'
    import axios from 'axios'

  export default {
    data() {
      return {

        headers:[
            { text: 'Jam', value: 'jam' },
            { text: 'Jumlah', value: 'jumlah'},
            { text: 'Keterangan', value: 'keterangan' },
            { text: 'Actions', value: 'actions', sortable: false },],

        // form
        loading2:false,
        dialog: false,
        jumlah: null,
        keterangan: ''
      }
    },
    computed:{
        ...mapGetters({
            kasMasuk: 'shift/getKasMasuk',
            data: 'shift/getData'
        }),   
     
    },    
    methods:{             
        ...mapMutations({
    
        }),               
        ...mapActions({
            fetchShift: 'shift/getDataShift'
        }),   
        getRp(text){
            if(text){
                var number_string = text.toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    text = sisa ? '.' : '';
                    rupiah += text + ribuan.join('.');
                }            
    
                return rupiah
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
        //  tambah kas
        tambahKas(){

                function convertTZ(date, tzString) {
                    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
                }
                let getDate = convertTZ(new Date,'Asia/Jakarta')             
               this.loading2 = true      
                axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/shift/tambahKas/${this.data._id}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        kas:'kasMasuk',
                        data:{
                            jam: getDate.getHours()+':'+getDate.getMinutes(),
                            jumlah: this.formatRupiahEsc(this.jumlah),
                            keterangan: this.keterangan
                        }
                    }
                    })
                    .then(({data}) =>{
                        this.keterangan = ''
                        this.jumlah = null
                        this.loading2 = false
                        this.dialog = false
                        this.fetchShift()
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
        deleteItem(data){
                Swal.fire({
                        title: 'Apakah anda yakin akan menghapus?',
                        showDenyButton: true,
                        confirmButtonText: `Batal`,
                        denyButtonText: `Ya,Hapus`,
                        }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                                
                        } else if (result.isDenied) {
                            this.loading2 = true
                                const temp = this.kasMasuk.filter(item => String(item._id) !== String(data._id))
                                    axios({
                                        url: `https://kueku-server-15ecaf79af24.herokuapp.com/shift/${this.data._id}`,
                                        method: 'put',
                                        headers:{
                                            token : localStorage.getItem('token')
                                        },
                                        data:{
                                            kasMasuk: temp
                                        }
                                        })
                                        .then(({data}) =>{
                                            this.fetchShift()
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
                        }
                    })   
 
        }
    },
    watch:{
        jumlah: function(){
            if(this.jumlah){
                var number_string = this.jumlah.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.jumlah = sisa ? '.' : '';
                    rupiah += this.jumlah + ribuan.join('.');
                }            
    
                this.jumlah = rupiah
            }
        },  
    },
    created(){
        console.log(this.kasMasuk)
    }
  }
</script>