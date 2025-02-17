import axios from 'axios'
import Swal from 'sweetalert2'

const state = {
    loading : false,
    listItem : [],
    totalHarga : 0,
    pembayaran: false,
    dataTransaksi:{},
    print: false,
    antrian: []
}
const mutations = {
    fillLoading(state,payload){
      state.loading = payload
    },
    fillItem(state,payload){
      if(payload === false){
        state.listItem = []
      }else{
        if(state.listItem.length > 0){
          let flag = false
          for(let i = 0 ; i < state.listItem.length ; i++){
            if(state.listItem[i].id === payload.id){
              state.listItem[i].qty = Number(payload.qty) + Number(state.listItem[i].qty)
              flag = true
              break
            }
          }
          if(!flag){
          state.listItem.push(payload)
          }
        }else{
          state.listItem.push(payload)
        }
      }
    },
    fillItem2(state,payload){
      state.listItem = payload
    },
    fillTotal(state,payload){
        state.totalHarga = payload
        },
    fillPembayaran(state,payload){
        state.pembayaran = payload
        },        
    fillTransaksi(state,payload){
      state.dataTransaksi = payload
    } ,
    fillPrint(state,payload){
      state.print = payload
      },
    fillAntrian(state,payload){
      state.antrian.push(payload)
    },
    fillAntrian2(state,payload){
      state.antrian = payload
    }
}
const actions = {
  addItem(context,payload,limit) {
      context.commit('fillItem',payload)
  },
  addAntrian(context,payload,limit){
    if(localStorage.getItem('antrian')){
      console.log(typeof(localStorage.getItem('antrian')) )     
      if(localStorage.getItem('antrian').length <= 5){
        let temp = localStorage.getItem('antrian')
        temp.push(payload)
        localStorage.setItem('antrian',temp)   
      }else{
        console.log('full')
      }
    }else{
      localStorage.setItem('antrian',[payload])
    }
    
    context.commit('fillAntrian',payload)
    context.commit('fillItem',false)
  },
  lanjutkanAntrian(context,payload,limit){
    context.commit('fillItem2',state.antrian[payload].listItem)
    let temp = state.antrian
    temp.splice(payload,1)
    context.commit('fillAntrian2',temp)
  },
  async createTransaksi(context,payload,limit){    
    context.commit('fillLoading',true)
    let tempItem = []
    let fail = false
    await payload.listItem.forEach(element => {
      let temp = {
        kodeBarang: element.kodeBarang,
        nama: element.nama,
        qty: Number(element.qty),
        harga: element.harga
      }
      if(Number(element.qty <= 0)){
        fail = true
      }
      tempItem.push(temp)
    });

    // payload.listItem = tempItem
    // context.commit('fillTransaksi',payload)
    // context.commit('fillPrint',true)
    if(fail){
      Swal.fire({
        icon: 'error',
        title: 'Cek Qty Barang!',
        text: 'Qty Barang Tidak Sesuai !',
        }) 
    }else{      
      axios({
        url: `https://kueku-server-15ecaf79af24.herokuapp.com/transaksi`,
        method: 'post',
        headers:{
            token : payload.pin 
        },
        data:{
            shift: payload.kasir.userId,
            listItem: tempItem,
            diskon:payload.diskon,
            totalHarga: payload.total,
            bayar: payload.bayar,
            pembayaran: payload.pembayaran               
        }
        })
          .then(({data}) =>{
            payload.id = data._id
            payload.listItem = tempItem
            payload.kasirName = data.kasir
            payload.jam = data.jam
            context.commit('fillTransaksi',payload)
            context.commit('fillPrint',true)
            context.commit('fillLoading',false)
          })
          .catch(err=>{            
              context.commit('fillLoading',false)
              if(err.response.status === 404){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'User Not Found !',
                  }) 
              }                    
          })     
    }
  },
  printBill(context,payload,limit){
    state.listItem = payload.listItem
    context.commit('fillTransaksi',payload)
    context.commit('fillPrint',true)
  }
}
const getters = {
    getLoading: (state) =>{
      return state.loading
    },
    getListItem : (state) => {
      return  state.listItem
    },
    getTotalHarga : (state) => {
        return  state.totalHarga
      },
    getPembayaran : (state) => {
        return  state.pembayaran
      },      
    getTransaksi :(state) =>{
      return state.dataTransaksi
    },
    getPrint : (state) => {
      return  state.print
    },
    getAntrian : (state) =>{
      return state.antrian
    } 
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}