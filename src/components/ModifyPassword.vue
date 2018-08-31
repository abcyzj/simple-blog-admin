<template>
    <div class="modify-password-container">
        <el-form :model="formData" ref="modifyPasswordForm" :rules="formRules">
            <el-form-item label="原密码" prop="password">
                <el-input v-model="formData.password" auto-complete="off" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword1">
                <el-input v-model="formData.newPassword1" auto-complete="off" type="password"></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="newPassword2">
                <el-input v-model="formData.newPassword2" auto-complete="off" type="password"></el-input>
            </el-form-item>
        </el-form>
        <div class="modify-password-btn-group" :style="{margin: '1em 0'}">
            <el-button type="primary" :disabled="!(formData.password.length >= 6 && formData.newPassword1.length >= 6
            && formData.newPassword2.length >= 6 && formData.newPassword1 === formData.newPassword2)" @click="submit">提交</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import { Form } from 'element-ui';
import axios from 'axios';
import { showNetworkError } from '@/utils/popup';

@Component
export default class ModifyPassword extends Vue {
    private formData = {
        password: '',
        newPassword1: '',
        newPassword2: '',
    };

    private formRules = {
        password: [
            {required: true, message: '请输入原密码'},
            {min: 6, message: '密码长度至少为6位', trigger: 'change'},
        ],
        newPassword1: [
            {required: true, message: '请输入新密码'},
            {min: 6, message: '密码长度至少为6位', trigger: 'change'},
        ],
        newPassword2: [
            {required: true, message: '请再输入一次新密码'},
            {min: 6, message: '密码长度至少为6位', trigger: 'change'},
            {validator: this.getValidator(), trigger: 'change'},
        ],
    };

    private async submit() {
        const res = await axios.post('/api/setPassword', {
            password: this.formData.password,
            newPassword: this.formData.newPassword1,
        });
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }

        if (res.data.success) {
            this.$message({
                type: 'success',
                message: '修改成功',
            });
        } else {
            this.$message({
                type: 'error',
                message: '修改失败',
            });
        }
    }

    @Watch('formData.newPassword1')
    private onNewPasswordChange() {
        if (this.formData.newPassword2.length === 0) {
            return;
        }
        const form = this.$refs.modifyPasswordForm as Form;
        form.validateField('newPassword2', (err) => {});
    }

    private getValidator() {
        return (rule: any, value: string, callback: (err: Error) => void) => {
            const data = this.formData;
            const form = this.$refs.modifyPasswordForm as Form;

            if (data.newPassword1 !== data.newPassword2) {
                callback(new Error('两次输入的密码不一致'));
            }
        };
    }
}
</script>

<style>
.modify-password-container {
    width: 50%;
    margin: 0 auto;
}
</style>
