<template>
  <div class="overflow-auto"> 
    <v-data-table
        :headers="headers"
        :items="allItem"
        class="elevation-1"
        :items-per-page="perPage"
        :loading="loading"
        hide-default-footer
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
        fields: ['KodeBarang', 'Nama', 'Stok', 'HargaEcer','HargaGrosir', 'Action'], 
        headers:[
            { text: 'Kode Barang', value: 'kodeBarang'},
            { text: 'Nama', value: 'nama' },
            { text: 'Stok', value: 'stok' },
            { text: 'Harga Ecer', value: 'hargaEcer' },
            { text: 'Harga Grosir', value: 'hargaGrosir' },
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
              hargaEcer: data.hargaEcer,
              hargaGrosir: data.hargaGrosir
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