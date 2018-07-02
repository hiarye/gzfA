<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '@/libs/util';

export default {
    data () {
        return {
            form: {
                userName: 'iview_admin',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // Cookies.set('user', this.form.userName);
                    // Cookies.set('password', this.form.password);
                    // this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                    // if (this.form.userName === 'iview_admin') {
                    //     Cookies.set('access', 0);
                    // } else {
                    //     Cookies.set('access', 1);
                    // }
                    // this.$router.push({
                    //     name: 'home_index'
                    // });
                    var userName = this.form.userName;
                    var password = this.form.password;
                    var store = this.$store;
                    var router = this.$router;
                    var vm = this;
                    Util.ajax.post('/login', {
                        userName,
                        password
                    })
                        .then(function (response) {
                            let respType = response.data.type;
                            let respData = response.data.data;
                            if (respType === '0') {
                                // Cookies.set('user', userName);
                                store.commit('login', userName, respData);
                                // window.alert(store.state.user.user);
                                // Cookies.set('password', password);
                                store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                                router.push({
                                    name: 'home_index'
                                });
                            } else {
                                vm.$Message.error(respData);
                                router.push({
                                    name: 'login'
                                });
                            }
                        })
                        .catch(function (error) {
                            vm.$Message.error(error);
                            router.push({
                                name: 'login'
                            });
                        });
                }
            });
        }
    }
};
</script>

<style>

</style>
