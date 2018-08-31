<template>
    <div class="editor-container" id="editorContainer">
        <el-form :inline="true" :model="formData" ref="editorForm">
            <el-form-item label="标题" prop="title" :rules="[{required: true, message: '请填写标题'}]">
                <el-input v-model="formData.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="categoryId" :rules="[{required: true, message: '请选择类别'}]">
                <el-select v-model="formData.categoryId" placeholder="类别">
                    <el-option v-for="category of categories" :value="category.id" :label="category.name"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <mavon-editor ref="mavonEditor" v-model="articleContent" language="zh-CN" @save="onSave" @imgAdd="uploadImg" :style="{minHeight: '500px'}"></mavon-editor>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
const MavonEditor = require('mavon-editor');
import 'mavon-editor/dist/css/index.css';
import { Form } from 'element-ui';
import axios from 'axios';
import { showNetworkError } from '@/utils/popup';

@Component
export default class ArticleEditor extends Vue {
    @Prop(String) private articleId: string;
    @Prop({type: Boolean, default: false}) private isNewArticle: boolean;

    private articleContent: string = '';

    private formData = {
        title: '',
        categoryId: '',
    };

    private categories: any[] = [];

    private async created() {
        await this.getCategoryData();
        if (!this.isNewArticle) {
            await this.getArticleInfo();
        }
    }

    private async getCategoryData() {
        const loadingComponent = this.$loading({
            target: '#editorContainer',
        });
        const res = await axios.get('/api/categoryTable');
        loadingComponent.close();
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }

        this.categories = res.data;
    }

    private async getArticleInfo() {
        const loadingComponent = this.$loading({
            target: '#editorContainer',
        });
        const res = await axios.get(`/api/adminArticleInfo/${this.articleId}`);
        loadingComponent.close();

        if (res.status === 404) {
            this.$message({
                type: 'error',
                message: '该文章不存在',
            });
            this.$router.back();
            return;
        }

        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }

        const data = res.data;
        this.formData.categoryId = data.categoryId;
        this.formData.title = data.title;
        this.articleContent = data.content;
    }

    private async onSave(value: string, render: string) {
        const form = this.$refs.editorForm as Form;
        if (!await form.validate()) {
            return;
        }

        const postData: any = {
            title: this.formData.title,
            categoryId: this.formData.categoryId,
            content: this.articleContent,
            isNewArticle: this.isNewArticle,
        };

        if (!this.isNewArticle) {
            postData.id = this.articleId;
        }

        const loadingComponent = this.$loading({
            target: '#editorContainer',
        });
        const res = await axios.post('/api/saveArticle', postData);
        loadingComponent.close();
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }

        if (res.data.success) {
            this.$message({
                type: 'success',
                message: '保存成功',
            });
        } else {
            this.$message({
                type: 'error',
                message: '保存失败，请重试',
            });
        }
    }

    private async uploadImg(pos: any, file: File) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post('/api/uploadImg', formData, {
            headers: {'Content-type': 'multipart/form-data'},
        });
        const editor = this.$refs.mavonEditor as any;
        if (res.status !== 200 && res.status !== 401) {
            this.$message({
                type: 'error',
                message: '上传失败',
            });
            editor.$refs.toolbar_left.$imgDelByFilename(file.name);
            return;
        }

        editor.$img2Url(pos, `/uploadImg/${res.data.filename}`);
        this.$message({
            type: 'success',
            message: '上传成功',
        });
    }
}
</script>
