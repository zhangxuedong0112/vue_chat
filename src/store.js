import Vue from 'vue'
import Vuex from 'vuex'
import req from "./utils/req";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        
    },
    mutations: {
        to_path (state, payload) {
            payload.$router.push({  //核心语句
                path: payload.path,   //跳转的路径
                query: payload.query || {},//传递的参数
            })
        }
    },
    actions: {
        register({commit,state}, payload){
            return new Promise(async resolve => {
                await req.req("/users/register", {}, payload).then(res=>{
                    // console.log("@@@@@=>", res._data.feedback_list, res._data.feedback_list.length);
                    console.log("@@@@@@@", payload, res);
                    // if(payload.type == "search"){
                    //     commit("set_feedback_data", res._data);//重新加载
                    // }else{
                    //     commit("push_feedback_data", res._data);//更多
                    // }
    
                    // return resolve(res._data.feedback_list.length);
                }).catch(e=>{
                    console.error("@@@@@=>",e)
                    return resolve(0);
                });
            });
            
        }

    }
})
