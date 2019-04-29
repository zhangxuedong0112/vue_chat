<template>
  <div class="pre">
        <div class="box " v-if="page=='login'">
            <Card :bordered="true">
                <p slot="title">在线聊天室内测版</p>
                <div class="body">
                    <Form ref="user" :model="user" :rules="ruleInline" inline>
                        <FormItem prop="user">
                            <Input type="text" v-model="user.user" placeholder="账号">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                        <FormItem prop="password">
                            <Input type="password" v-model="user.password" placeholder="密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                    </Form>
                </div>
                <div class="footer">
                    <Button type="success">登录</Button>
                    <Button type="info" @click="check_page('register')">注册</Button>
                </div>
            </Card>
        </div>
        <div class="box " v-else>
            <Card :bordered="true">
                <p slot="title">注册聊天室账号</p>
                <div class="body">
                    <Form ref="user" :model="user" :rules="ruleInline" inline>
                        <FormItem prop="user">
                            <Input type="text" v-model="user.user" placeholder="账号">
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
                        <FormItem prop="password">
                            <Input type="password" v-model="user.password" placeholder="密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                        <FormItem prop="password">
                            <Input type="password" v-model="user.password2" placeholder="再次输入密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <br/>
                    </Form>
                </div>
                <div class="footer">
                    <Button type="info" class="margin_none" @click="check_page('login')">注册</Button>
                </div>
            </Card>
        </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: 'home',
    data(){
        return{
            page: "login",
            user: {
                user: '',
                password: '',
                password2: '',
                name: "",
            },
            ruleInline: {
                user: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入昵称', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度最少6位', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        ...mapActions(["register"]),
        check_page(page){
            this.page = page || login;
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

