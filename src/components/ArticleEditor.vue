<template>
    <div class="editor-container">
        <el-form :inline="true" :model="formData" ref="editorForm">
            <el-form-item label="标题" prop="title" :rules="[{required: true, message: '请填写标题'}]">
                <el-input v-model="formData.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="category" :rules="[{required: true, message: '请选择类别'}]">
                <el-select v-model="formData.category" placeholder="类别">
                    <el-option v-for="category of categories" :value="category" :label="category"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <mavon-editor v-model="articleContent" language="zh-CN" @save="onSave"></mavon-editor>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
const MavonEditor = require('mavon-editor');
import 'mavon-editor/dist/css/index.css';
import { Form } from 'element-ui';

@Component
export default class ArticleEditor extends Vue {
    @Prop(String) private articleId: string;
    @Prop({type: Boolean, default: false}) private isNewArticle: boolean;

    private articleContent: string = '';

    private formData = {
        title: '',
        category: '',
    };

    private categories: string[] = ['你好', '我们'];

    private async onSave(value: string, render: string) {
        const form = this.$refs.editorForm as Form;
        if (!await form.validate()) {
            return;
        }

        //TODO
        this.$message({
            type: 'success',
            message: '保存成功',
        });
    }
}
</script>
