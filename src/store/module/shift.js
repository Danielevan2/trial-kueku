import axios from 'axios'

const state = {
    loading : false,
    data : null,
    kasKeluar: [],
    kasMasuk: [],
    shift: null
}
const mutations = {
    fillLoading(state,payload){
        state.loading = payload
        },    
    fillData(state,payload){
        state.data = payload
        },  
    fillShift(state,payload){
        state.shift = payload
        }, 
    fillKasKeluar(state,payload){
      state.kasKeluar = payload
      },           
    fillKasMasuk(state,payload){
      state.kasMasuk = payload
      },         
}
const actions = {
  getDataShift(context,payload,limit) {
      context.commit('fillShift',false)                
      axios({
        url: `https://kueku-server-15ecaf79af24.herokuapp.com/shift/kasir/login`,
        method: 'get',
        headers:{
            token : localStorage.getItem('token')
        }
      })      
            .then(({data})=>{                        
              if(data.length === 1 && data[0].jamKerja.pulang === '-'){
                context.commit('fillData',data[0])
                context.commit('fillKasKeluar',data[0].kasKeluar)
                context.commit('fillKasMasuk',data[0].kasMasuk)
                context.commit('fillShift',true)                
              }else{
                context.commit('fillData',null)
              }
            })
            .catch(err=>{
                console.log(err)
            })
  }
}
const getters = {
    getLoading : (state) => {
        return  state.loading
      },    
    getData : (state) => {
      return  state.data
    },  
    getShift : (state) => {
      return  state.shift
    }, 
    getKasKeluar : (state) => {
      return  state.kasKeluar
    },     
    getKasMasuk : (state) => {
      return  state.kasMasuk
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}