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
        <vue-recaptcha :style="{marginBottom: '10px'}" sitekey="6LeKqW0UAAAAAGn0EcPsOSIJYZXnjzsTeU9JzEBU" @verify="onRecaptchaVerify" @expired="onRecaptchaExpired"></vue-recaptcha>
        <el-button :style="{width: '100%'}" type="primary" :round="true" @click="handleLogin" :disabled="true" ref="loginButton">登录</el-button>
    </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {Action} from 'vuex-class';
import {Form} from 'element-ui';
import axios from 'axios';
import VueRecaptcha from 'vue-recaptcha';
import { ElButton } from 'element-ui/types/button';

@Component({
    components: {VueRecaptcha},
})
export default class Login extends Vue {
    @Action('login') private actionLogin: (userInfo: any) => Promise<void>;

    private loginForm = {
        username: '',
        password: '',
        recaptchaResponse: '',
    };

    private loginRules = {
        username: [{required: true, message: '请输入用户名', trigger: 'change'}],
        password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码长度不能短于6位', trigger: 'change'},
        ],
    };

    private async mounted() {
        const recaptchaScript = document.createElement('script');
        recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit');
        recaptchaScript.setAttribute('async', 'async');
        recaptchaScript.setAttribute('defer', 'defer');
        document.head.appendChild(recaptchaScript);
    }

    private async handleLogin() {
        const form: Form = this.$refs.loginForm as Form;
        if (await form.validate()) {
            try {
                if (await this.actionLogin(this.loginForm)) {
                    this.$router.push('/');
                } else {
                    this.$message({
                        type: 'error',
                        message: '登录失败',
                    });
                }
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: '网络错误',
                });
            }
        }
    }

    private onRecaptchaVerify(response: string) {
        const loginButton = this.$refs.loginButton as ElButton;
        loginButton.disabled = false;
        this.loginForm.recaptchaResponse = response;
    }

    private onRecaptchaExpired() {
        const loginButton = this.$refs.loginButton as ElButton;
        loginButton.disabled = true;
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
