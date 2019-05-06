import Vue from 'vue'
import Vuex from 'vuex'
import req from "./utils/req";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {},
        // to: {},
        // msg_list: [],
        // friend_list: []
    },
    mutations: {
        to_path (state, payload) {
            payload.$router.push({  //核心语句
                path: payload.path,   //跳转的路径
                query: payload.query || {},//传递的参数
            })
        },
        set_user(state, payload){
            state.user = payload;
        },
        // set_to(state, payload){
        //     state.to = payload;
        // },
        // set_msg_list(state, payload){
        //     state.msg_list = payload;
        // },
        // set_friend_list(state, payload){
        //     state.friend_list = payload;
        // }
    },
    actions: {
        register({commit,state}, payload){
            return new Promise(async (resolve, reject) => {
                await req.req("/users/register", {}, payload).then(res=>{
                    // console.log("@@@@@=>", res._data.feedback_list, res._data.feedback_list.length);

                    if(res.code != 200){
                        return reject(res.msg);
                    }

                    return resolve(res.data);
                }).catch(e=>{
                    console.error("@@@@@=>",e)
                    return reject(0);
                });
            });
            
        },
        login({commit,state}, payload){
            return new Promise(async (resolve, reject) => {
                await req.req("/users/login", {}, payload).then(res=>{
                    // console.log("@@@@@=>", res._data.feedback_list, res._data.feedback_list.length);

                    if(res.code != 200){
                        return reject(res.msg);
                    }
                    commit("set_user", res.data);
                    return resolve(res.data);
                }).catch(e=>{
                    console.error("@@@@@=>",e)
                    return reject(0);
                });
            });
            
        },
        init_friend_list({commit,state}, payload){
            return new Promise(async (resolve, reject) => {
                
                await req.req("/users/friends", {}, state.user).then(res=>{
                    // console.log("@@@@@=>", res._data.feedback_list, res._data.feedback_list.length);

                    if(res.code != 200){
                        return reject(res.msg);
                    }
                    // commit("set_friend_list", res.data);
                    return resolve(res.data);
                }).catch(e=>{
                    console.error("@@@@@=>",e)
                    return reject(0);
                });
            });
            
        },
        init_msg_list({commit,state}, payload){
            return new Promise(async (resolve, reject) => {
                
                await req.req("/users/msg_list", {}, payload).then(res=>{
                    console.log("@@@@@=>", res);

                    if(res.code != 200){
                        return reject(res.msg);
                    }
                    // commit("set_friend_list", res.data);
                    return resolve(res.data);
                }).catch(e=>{
                    console.error("@@@@@=>",e)
                    return reject(0);
                });
            });
            
        }

    }
})
