<template>
  <div class="pre flex_center">
      <div class="chat_pre">
          <div class="left_pre">
              <div class="header_pre flex_center">
                  <a>
                      <Avatar style="background-color: #87d068" icon="ios-person" size="large"/>
                  </a>
                  <div class="user_name">
                      <b>
                        {{user && user.name || ""}}
                      </b>
                  </div>
              </div>
              <div class="friend_pre">
                  <ul class="friend_ul">
                      <li class="flex_center " v-for="u in friend_list" :key="u._id" @click="start_chat(u)" :class="{'sel': u._id == to._id}" >
                          <div class="friend_detail">
                              <div class="detail1 flex_center detail">
                                    <Badge :dot="new_msg[u.user_name] && new_msg[u.user_name].from.user_name!=to.user_name && (new_msg[u.user_name] && new_msg[u.user_name].show_new)">
                                        <Avatar style="background-color: #87d068" icon="ios-person"/>
                                    </Badge>
                              </div>
                              <div class="detail2 detail">
                                  <p class="name">{{u.name}}</p>
                                  <p class="content">{{new_msg[u.user_name] && new_msg[u.user_name].txt || "无新消息"}}</p>
                              </div>
                              <div class="detail3 detail">
                                  <p>{{new_msg[u.user_name] && new_msg[u.user_name].time || ""}}</p>
                              </div>
                          </div>
                      </li>
                      
                  </ul>
              </div>
          </div>
          <div class="right_pre flex_center">
              <div class="writer_pre" v-show="to._id">
                  <div class="msg_box">
                      <ul class="msg_ul" id="msg_box">
                          <li class="" v-for="m in msg_list" :key="m._id">
                              <div class="msg_detail" :class="m.from.user_name == user.user_name?'right':'left'">
                                  
                                <div class="txt_1 flex_center">
                                    <Avatar style="background-color: #87d068" icon="ios-person"/>
                                    <b>{{m.from.name}}</b>
                                </div>

                                <div class="txt_2">
                                    <p>
                                        {{m.txt}}
                                    </p>
                                </div>

                                <div class="txt_3">
                                    <p>{{m.time}}</p>
                                </div>
                              </div>
                              
                          </li>


                      </ul>
                  </div>
                  <div class="edit_box">
                      <div class="eidt_txt">
                        <textarea name="" id="" autofocus v-model="msg" @keyup.enter="send_msg"></textarea>
                      </div>
                      <Button type="success" class="send_btn" @click="send_msg">发 送</Button>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions, mapMutations } from 'vuex'
import io from 'socket.io-client';

export default {
    name: 'home',
    data(){
        return {
            ws: null,
            msg: "",
            friend_list: [],
            to: {},
            msg_list: [],
            new_msg: {}
        }
    },
    computed: {
        ...mapState(['user']),
    },
    async created(){
        // console.log("@@@@@@", this.user, this.to);
        if(!this.user._id){
            this.to_path({
                $router: this.$router,
                path: "/login"
            })   

            return;
        }

        
        await this.init_socket();
        this.friend_list = await this.init_friend_list();
        // for (let index = 0; index < this.friend_list.length; index++) {
        //     let f = this.friend_list[index];
        //     f.has_new_msg = false;
        // }
    },
    methods:{
        ...mapMutations(["to_path"]),
        ...mapActions(["init_friend_list", "init_msg_list"]),
        async start_chat(to){
            let new_m = this.new_msg[to.user_name];
            if(new_m && new_m.show_new){
                new_m.show_new = false;
            }

            this.to = to;
            let obj = {
                from: this.user.user_name,
                to: this.to.user_name
            }
            
            this.msg_list = await this.init_msg_list(obj);
            this.scroll_bottom();
        },
        scroll_bottom(){
            setTimeout(()=>{
                var scrollDom = document.getElementById('msg_box');
                scrollDom.scrollTop = scrollDom.scrollHeight;
            },50)
        },
        send_msg(){
            if(this.msg.length==0){
                return;
            }

            if(!this.to){
                return;
            }

            let user_msg = {
                from: this.user,
                to: this.to,
                msg_type: "txt",
                txt: this.msg
            }

            this.ws.emit("send_to_user", user_msg);

            this.msg = "";

        },
        init_socket(){

            this.ws = io('ws://localhost:3001');

            this.ws.on('connection', (socket)=>{
                console.log("连接成功");
                this.ws.emit("bind", this.user);
            
                this.ws.on('bind', (socket)=>{
                    if(socket.code == 200){
                        console.log("用户绑定成功");
                    }else{
                        console.log("用户绑定失败");
                    }
                })
            })

            this.ws.on('user_msg', (socket)=>{
                console.log("user_msg", socket);
                this.msg_list.push(socket);

                if(this.msg_list.length>50){
                    this.msg_list.shift();
                }
                
                if(socket.from.user_name != this.user.user_name){
                    // this.to.txt = socket.txt;
                    // this.to.time = socket.time;
                    this.new_msg[socket.from.user_name] = socket;
                    if(socket.from.user_name == this.to.user_name){
                        this.new_msg[socket.from.user_name].show_new = false;
                    }else{
                        this.new_msg[socket.from.user_name].show_new = true;
                    }
                    

                    this.$Notice.open({
                        title: socket.from.user_name,
                        desc: socket.txt,
                        duration: 2
                    });
                }
                
                this.scroll_bottom();
            })

        }
    }
}
</script>
<style lang="less" scoped>
.chat_pre{
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    // background: #808695
    border: 1px solid #dcdee2;
    border-radius: 5px;
}
.left_pre{
    width: 300px;
    // border-right: 1px solid #dcdee2;
    height: 100%;
    float: left;
    background: #edeae8;
}
.header_pre{
    width: 100%;
    height: 149px;
    border-bottom: 1px solid#dcdee2;
    position: relative;
    .user_name{
        position: absolute;
        top: 100px;
        b{
            font-size: 14px;
        }
    }
}
.friend_pre{
    width: 100%;
    height: calc(100% - 150px);
}
.friend_ul{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    li{
        cursor: pointer;
        width: 100%;
        height: 65px;
        .friend_detail{
            width: calc(100% - 20px);
            height: calc(100% - 20px);
            // background: red;
        }
        .detail{
            float: left;
            p{
                overflow: hidden;/*超出部分隐藏*/
                white-space: nowrap;/*不换行*/
                text-overflow:ellipsis;/*超出部分文字以...显示*/
            }
        }
        .detail1{
            height: 100%;
            width: 50px;
        }
        .detail2{
            height: 100%;
            width: calc(100% - 100px);
            .name{
                // display: inline-block;
                // line-height: 45px;
                font-size: 14px;
                color: #000000;
            }
            .content{
                color: #999999;
            }
        }
        .detail3{
            height: 100%;
            width: 50px;
            p{
                float: right;
                color: #999999;
            }
        }
    }
    li:hover{
        background: #c3c4c6;
    }
    .sel{
        background: #c3c4c6;
    }
}
    
.right_pre{
    width: calc(100% - 300px);
    height: 100%;
    float: left;
    background: #f5f5f5;
    .writer_pre{
        width: calc(100% - 40px);
        height: calc(100% - 40px);
        .msg_box{
            height: calc(100% - 199px);
            border-bottom: 1px solid #dcdee2;
        }
        .edit_box{
            height: 200px;
            .send_btn{
                float: right;
                width: 150px;
            }
            .eidt_txt{
                margin-top: 10px;
                height: calc(100% - 45px);
                textarea{
                    border: none;
                    width: 100%;
                    height: 100%;
                    resize: none;
                    background: #f5f5f5;
                    font-size: 14px;
                }
            }
        }
    }
}
.msg_ul{
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    .left{
        float: left;
        div{
            float: left;
        }
        .txt_2 p{
            float: left;
        }
        .txt_3{
            p{
                float: right;
            }
        }
    }
    .right{
        float: right;
        div{
            float: right;
        }
        .txt_2 p{
            float: right;
        }
        .txt_3{
            p{
                float: left;
            }
        }
    }
    li{
        width: 100%;
        margin-top: 10px;
        margin-bottom: 40px;
        .msg_detail{
            width: 80%;
            .txt_1{
                width: 80px;
                position: relative;
                b{
                    position: absolute;
                    top: 35px;
                }
            }
            .txt_2{
                max-width: calc(100% - 160px);
                p{
                    font-size: 14px;
                    color: #000000;
                }
            }
            .txt_3{
                width: 70px;
                p{
                    color: #999999;
                }
            }
        }
        
    }
    li:after {  content: "."; display: block; height: 0; clear: both; visibility: hidden;  }
} 
</style>

