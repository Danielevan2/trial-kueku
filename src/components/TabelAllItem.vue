<template>
  <div class="overflow-auto"> 
    <v-text-field
        v-if="shift === true && getRole === 'kasir' || getRole === 'super'"
        solo
        label="Search"
        append-icon="mdi-magnify"
        v-on:keyup.enter="search(1)"
        class="mr-4 ml-4"
        clearable
        v-model="src"
    ></v-text-field>    


    <v-data-table
        :headers="headers"
        :items="allItem"
        class="elevation-1"
        :items-per-page="perPage"
        :loading="loading"
        hide-default-footer
    >
        <template v-slot:item.image="{ item }">
          <img :src="item.image" width="100" height="50"/>
        </template>

        <template v-slot:item.harga="{ item }">
          <p>Rp {{getRupiah( item.harga)}}</p>
        </template>  

        <template v-slot:item.actions="{ item }">
            <a @click="plusItem(item)">
              <v-icon color="green" v-b-popover.hover.top="'Tambah Item'" dense>mdi-cart-plus</v-icon>
            </a> 
        </template>    
    </v-data-table>


    <b-pagination
    class="mt-2"
    v-if="allItem.length > 0"
    v-model="currentPage"
    :total-rows="totalItem"      
    :per-page="perPage"
    aria-controls="my-table"
    align="center"
    ></b-pagination> 

  </div>

</template>

<script>
    import { mapGetters,mapActions,mapMutations } from 'vuex'
    import Swal from 'sweetalert2'
    import axios from 'axios'
  export default {
    data() {
      return {
        perPage: 20,
        currentPage: 1,
        fields: ['gambar', 'Nama', 'Stok', 'Harga', 'Action'], 
        headers:[
            { text: 'Image', value: 'image'},
            { text: 'Nama', value: 'nama' },
            { text: 'Stok', value: 'stok' },
            { text: 'Harga', value: 'harga' },
            { text: 'Actions', value: 'actions', sortable: false },],           
        src: ''
      }
    },
    computed:{
        ...mapGetters({
        allItem: 'item/getAllItem',
        totalItem: 'item/getTotalItem',
        loading:'item/getLoading',
        shift: 'shift/getShift'         
        }),   
        getRole(){
          return this.$store.state.userRole
        }             
    },    
    methods:{
        ...mapMutations({
          fillData: 'item/fillData',
          fillTotal: 'item/fillTotal',  
          fillLoading: 'item/fillLoading'        
        }),          
        ...mapActions({
          fetchItem: 'item/fetchAction',
          addItem: 'transaksi/addItem',
        }),       
        search(page){          
          if(this.src === ''){
                this.fetchItem(1,this.perPage)
          } else{
            if(page === 1){
              this.currentPage = 1
            }         
            this.fillLoading(true)
            this.fillData([])
            axios({
              url: `https://kueku-server-15ecaf79af24.herokuapp.com/item/search?src=${this.src}&page=${this.currentPage}&limit=${this.perPage}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{ 
                    if(Number(data.Total) === 1){
                      this.plusItem(data.results[0])
                    }                     
                    this.fillTotal(data.Total)
                    this.fillData(data.results)
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
        }      ,          
        plusItem(data){
          if(Number(data.stok) > 0){
            this.src = ''
            let temp = {
              id: data._id,
              nama: data.nama,
              kodeBarang: data.kodeBarang,
              qty: 1,
              stok:data.stok,
              harga: data.harga
            }
            this.addItem(temp)          
          }
        },           
    },
    watch:{
    qty: function(){
        if(this.qty >= 3){
            this.harga = this.getRupiah(this.qty * this.hargaGrosir)
            
        }else{
            this.harga = this.getRupiah(this.qty * this.hargaEcer)
        }
    },
    currentPage: function(){
          if(this.src === ''){
            this.fetchItem(this.currentPage,this.perPage)
          }else{
            this.search()
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
    shift: function(){
        if(this.getRole === 'kasir'){
          if(this.shift === true){
            this.fetchItem(this.currentPage,this.perPage)       
          }
        }
    }          
    },
    created(){
        if(this.getRole === 'kasir'){
          if(this.shift === true){
            this.fetchItem(this.currentPage,this.perPage)       
          }
        }else{
          this.fetchItem(this.currentPage,this.perPage)       
        }
    }
  }
</script>