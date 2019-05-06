<template>
  <div class="pre">
        <div class="box " v-if="page=='login'">
            <Card :bordered="true">
                <p slot="title">在线聊天室内测版</p>
                <div class="body">
                    <Form ref="user" :model="user" :rules="ruleInline" inline>
                        <FormItem prop="user_name">
                            <Input type="text" v-model="user.user_name" placeholder="账号">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                        <FormItem prop="pwd">
                            <Input type="password" v-model="user.pwd" placeholder="密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                    </Form>
                </div>
                <div class="footer">
                    <Button type="success" @click="go_home">登录</Button>
                    <Button type="info" @click="check_page('register')">注册</Button>
                </div>
            </Card>
        </div>
        <div class="box " v-else>
            <Card :bordered="true">
                <p slot="title">注册聊天室账号</p>
                <div class="body">
                    <Form ref="user" :model="user" :rules="ruleInline" inline>
                        <FormItem prop="user_name">
                            <Input type="text" v-model="user.user_name" placeholder="账号">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                        <FormItem prop="name">
                            <Input type="text" v-model="user.name" placeholder="昵称">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                        <FormItem prop="pwd">
                            <Input type="password" v-model="user.pwd" placeholder="密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                        <FormItem prop="password2">
                            <Input type="password" v-model="user.password2" placeholder="再次输入密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                    </Form>
                </div>
                <div class="footer">
                    <Button type="success" @click="go_register">注册</Button>
                    <Button type="info" @click="check_page('login')">返回</Button>
                </div>
            </Card>
        </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    name: 'home',
    data(){
        return{
            page: "login",
            user: {
                user_name: '',
                pwd: '',
                password2: '',
                name: "",
            },
            ruleInline: {
                user_name: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入昵称', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度最少6位', trigger: 'blur' }
                ],
                password2: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度最少6位', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.user.user_name = window.localStorage.getItem("user_name")||'';
        this.user.pwd = window.localStorage.getItem("pwd")||'';
    },
    methods: {
        ...mapMutations(["to_path"]),
        ...mapActions(["register","login"]),
        check_page(page){
            this.page = page || login;
        },
        async go_home(){
            if(!this.user.user_name){
                this.$Message.error('请输入用户名');
                return;
            }

            if(!this.user.pwd){
                this.$Message.error('请输入密码');
                return;
            }

            try {
                let r = await this.login(this.user);

                window.localStorage.setItem("user_name", this.user.user_name);
                window.localStorage.setItem("pwd", this.user.pwd);

                this.to_path({
                    $router: this.$router,
                    path: "/home"
                })    
            } catch (error) {
                this.$Message.error(error);
                console.error(error)
            }
            
        },
        async go_register(){
            if(!this.user.user_name){
                this.$Message.error('请输入用户名');
                return;
            }

            if(!this.user.name){
                this.$Message.error('请输入昵称');
                return;
            }

            if(!this.user.pwd){
                this.$Message.error('请输入密码');
                return;
            }

            if(!this.user.password2){
                this.$Message.error('请输入确认密码');
                return;
            }

            if(this.user.pwd != this.user.password2){
                this.$Message.error('两次输入密码不一致');
                return;
            }

            if(this.user.pwd.length<6){
                this.$Message.error('密码长度最少6位');
                return;
            }

            try {
                await this.register(this.user);    
                this.check_page('login');
            } catch (error) {
                this.$Message.error(error);
                console.error(error)
            }
            

            
        }
    },
}
</script>

<style lang="less" scoped>
.pre{
    position:relative;
    background: url('../assets/img/31bde51c1d61488e895cf921c4b9e739.jpg')
}
.box{
    width: 300px;
    height: 300px;
    // background: red;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .ivu-form-item{
        width: 95%;
    }
}
.footer{
    text-align: center;
    button{
        margin-right: 20px;
    }
}
</style>

