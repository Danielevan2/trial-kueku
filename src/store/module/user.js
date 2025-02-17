import axios from 'axios'

const state = {
    loading2 : false,
    allUser : [],
    totalUser : 0,
}
const mutations = {
    fillLoading2(state,payload){
        state.loading = payload
        },    
    fillData2(state,payload){
        state.allUser = payload
        },
    fillTotal2(state,payload){
        state.totalUser = payload
        }      
}
const actions = {
  fetchAction(context,payload,limit) {
      context.commit('fillLoading2',true)
      context.commit('fillData2',[])
      axios({
        url: `https://kueku-server-15ecaf79af24.herokuapp.com/user/admin?page=${payload}&limit=${limit}`,
        method: 'get',
        headers:{
            token : localStorage.getItem('token')
        }
      })      
            .then(({data})=>{          
                    context.commit('fillData2',data.results)
                    context.commit('fillTotal2',data.Total)
                    context.commit('fillLoading2',false)
            })
            .catch(err=>{
                console.log(err)
            })
  }
}
const getters = {
    getLoading2 : (state) => {
        return  state.loading2
      },    
    getAllUser : (state) => {
      return  state.allUser
    },
    getTotalUser : (state) => {
        return  state.totalUser
      }     
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}