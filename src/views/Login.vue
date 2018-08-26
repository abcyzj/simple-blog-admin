<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <h3 class="title">Simple Blog</h3>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
        </el-form>
        <el-button :style="{width: '100%'}" type="primary" :round="true" @click="handleLogin">登录</el-button>
    </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {Form} from 'element-ui';
import axios from 'axios';

@Component
export default class Login extends Vue {
    private loginForm = {
        username: '',
        password: '',
    };

    private loginRules = {
        username: [{required: true, message: '请输入用户名', trigger: 'change'}],
        password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码长度不能短于6位', trigger: 'change'},
        ],
    };

    private async handleLogin() {
        const form: Form = this.$refs.loginForm as Form;
        if (await form.validate()) {
            // TODO 登录相关
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
.title {
    text-align: center;
}

.login-container {
    width: 30%;
    margin: 1em auto;
    padding: 1em;
    border-radius: 10px;
    box-shadow: 1px 1px 15px rgba(67,38,100,0.15);
}
</style>
