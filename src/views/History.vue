<template>
  <div class="overflow-auto"> 
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
                @click.prevent="getByDate()"
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
                    label="Search"
                    append-icon="mdi-magnify"
                    v-on:keyup.enter="search(1)"
                    class="mr-4 ml-4"
                    clearable
                    v-model="src"        
                ></v-text-field>              
            </v-col>
        </v-row>     
        <v-btn
          @click="sortNama()"
        >
        Sort Nama
        </v-btn>   
    <v-data-table
        :sort-by="['nama']"
        :headers="headers"
        :items="allItem"
        class="elevation-2"
        :loading="loading"
        :per-page="perPage"
        :footer-props="{'items-per-page-options':[20, 50, 80, -1]}" 
    >   
        <template v-slot:item.nama="{ item }">
          <td v-if="item.item !== null">{{item.item.nama}}</td>
          <td v-if="item.item === null">-</td>
        </template> 
        <template v-slot:item.selisih="{ item }">
          <b-badge variant="success" class="lg" v-if="item.stokBaru >= item.stokLama">+ {{Number(item.stokBaru) - Number(item.stokLama)}}</b-badge>
          <b-badge variant="danger" class="lg" v-if="item.stokBaru < item.stokLama">{{Number(item.stokBaru) - Number(item.stokLama)}}</b-badge>
        </template> 
    </v-data-table>
    
  </div>

</template>

<script>
    import axios from 'axios'

  export default {
    data() {
      return {
        perPage: 25,
        currentPage: 1,

        // search
        src: '',
        date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu1: false,
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu2: false,
        headers:[            
            { text: 'Tanggal', value: 'tanggal' },
            { text: 'Jam', value: 'jam' },
            { text: 'Nama', value: 'nama' },
            { text: 'StokLama', value: 'stokLama' },
            { text: 'StokBaru', value: 'stokBaru' },
            { text: 'Selisih', value: 'selisih' },
            { text: 'Admin', value: 'admin.username' },            
        ]    ,
        loading: true,
        allItem: [] ,
        flag : true
      }
    },
    computed:{  
        getRole(){
          return this.$store.state.userRole
        }           
    },    
    methods:{     
        sortNama(){
          if(this.flag){
            this.allItem.sort((a, b) => {
              if(a.item === null){
                a.item = {nama:"-"}
              }
              return a.item.nama.localeCompare(b.item.nama);
            });
            this.flag = false
          }else{
            this.allItem.sort((a, b) => {
              if(a.item === null){
                a.item = {nama:"-"}
              }
              return b.item.nama.localeCompare(a.item.nama);
            });
            this.flag = true
          }
        },
        fetchItem(){
            axios({
              url: `http://localhost:3000/item/history`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{      
                        this.allItem = data.results
                        this.loading = false         
                  })
                  .catch(err=>{
                      console.log(err)
                  })        
        },
        search(page){      
          
          if(this.src === ''){
                this.fetchItem(1,this.perPage)
          } else{
            if(page === 1){
              this.currentPage = 1
            }         
            this.loading = true
            axios({
              url: `http://localhost:3000/item/search/history?src=${this.src}&page=${this.currentPage}&limit=${this.perPage}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{            
                        this.allItem = data.results
                        this.loading = false  
                  })
                  .catch(err=>{
                      console.log(err)
                  })        
          }         
        },
        getByDate(){
            this.src = ''
            this.loading = true
            axios({
                url: `http://localhost:3000/item/search/date/history?mulai=${this.date1}&akhir=${this.date2}`,
                method: 'get',
                headers:{
                    token : localStorage.getItem('token')
                }
            })      
                    .then(({data})=>{                   
                        this.allItem = data
                        this.loading = false
                    })
                    .catch(err=>{
                        console.log(err)
                    })            
        },                    
    },
    watch:{
        src: function(){
          if(this.src === ''){
            this.fetchItem(1,this.perPage)       
          }
        },
        currentPage: function(){
          if(this.src === ''){
            this.fetchItem(this.currentPage,this.perPage)
          }else{
            this.search(this.currentPage)
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
        }                          
    },
    created(){
        this.getByDate()       
    }
  }
</script>

<style>
.v-data-table .v-data-table-header tr th {
  font-size: smaller !important;
}

.text-start table.v-table tbody td {
    font-size: small !important;
}

.text-start td {
  font-size: x-small;
}
</style>