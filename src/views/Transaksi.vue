<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5" v-if="!print">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Transaksi</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
    <v-row>
        <v-col cols="12" md="7" v-if="!print">
            <b-card class="ml-1"  footer-tag="footer" header-tag="header" >
                <Tabelitem />                          
            </b-card>  
        </v-col>
        <v-col cols="12" md="5">  
          <b-card class="mr-1" v-if="!print" >                
              <Cart />
          </b-card>
        </v-col>
    </v-row>    

    <Billing v-if="print" />        

    <!-- kasir belum mulai shift -->
    <v-dialog
        v-model="dialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Belum Memulai Shift?
          </v-card-title>

          <v-card-text>
            pilih halaman shift lalu lakukan MULAI SHIFT terlebih dahulu.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              Mengerti
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>         
    <!-- kasir belum mulai shift -->
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Tabelitem from '../components/TabelAllItem.vue'
  import Billing from '../components/Billing.vue'
  import Cart from '../components/Cart.vue'
  import Swal from 'sweetalert2'

  export default {
    data() {
      return {
        src: '',

        // shift
        dialog: false
      }
    },
    components: {
        Tabelitem,
        Billing,
        Cart
    },
    computed:{
        ...mapGetters({
            print: 'transaksi/getPrint',
            allItem: 'item/getAllItem',
            loading: 'item/getLoading',
            //shift kasir
            shift: 'shift/getShift' ,
            data: 'shift/getData'

        }),      
        getRole(){
          return this.$store.state.userRole
        }             
    },        
    watch: {
        src: function(){
            console.log(this.src)
        },
        data: function(){
            if(this.data === null){
                this.dialog = true
            }
        }   
    },   
    methods: { 
        ...mapActions({
            fetchItem: 'item/fetchAction',
            fetchShift: 'shift/getDataShift'
        }),               
    },
    created(){
          if(this.getRole === 'kasir' || this.getRole === 'admin'){
            if(this.data === null){
                this.dialog = true
            }
          }
         this.fetchShift()
    }      
  }
</script>