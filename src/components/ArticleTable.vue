<template>
    <div class="article-table-container">
        <el-table ref="articleTable" :data="tableData" stripe :loading="loading" highlight-current-row @current-change="onCurrentChange">
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="date" label="修改日期" sortable></el-table-column>
            <el-table-column prop="viewNumber" label="阅读量" sortable></el-table-column>
            <el-table-column prop="categoryName" label="类别" :filters="filters" :filter-method="(value, row) => value === row.categoryName"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="onEdit(scope.$index)" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDelete(scope.$index)" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="article-table-btn-group">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'newArticle'})">新文章</el-button>
            <el-button type="primary" icon="el-icon-check" @click="setAboutArticle" :disabled="!currentRow">设置关于页面</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import axios from 'axios';
import {showNetworkError} from '@/utils/popup';

@Component
export default class ArticleTable extends Vue {
    private tableData: any[] = [];
    private loading: boolean = false;

    private filters: any[] = [];

    private currentRow: any = null;

    @Watch('tableData')
    private onTableDataChange() {
        this.filters = [];
        for (let data of this.tableData) {
            if (this.filters.findIndex((value, ind, obj) => value === data.category) === -1) {
                this.filters.push({
                    text: data.category,
                    value: data.category,
                });
            }
        }
    }

    private async mounted() {
        await this.getTableData();
    }

    private onEdit(index: number) {
        this.$router.push({name: 'editArticle', params: {articleId: this.tableData[index].id}});
    }

    private async onDelete(index: number) {
        const article = this.tableData[index];
        try {
            await this.$confirm(`此操作将永久删除"${article.title}"，是否继续？`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            });
        } catch (err) {
            this.$message({
                type: 'info',
                message: '已取消',
            });
            return;
        }

        this.loading = true;
        const res = await axios.post('/api/deleteArticle', {id: article.id});
        this.loading = false;
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }

        if (res.data.success) {
            this.$message({
                type: 'success',
                message: `已删除"${article.title}"`,
            });
        } else {
            this.$message({
                type: 'error',
                message: `删除"${article.title}失败"`,
            });
        }

        await this.getTableData();
    }

    private async getTableData() {
        this.loading = true;
        const res = await axios.get('/api/articleTable');
        this.loading = false;
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }

        this.tableData = res.data;
    }

    private onCurrentChange(row: any) {
        this.currentRow = row;
    }

    private async setAboutArticle() {
        this.loading = true;
        const res = await axios.post('/api/setAboutArticle', {id: this.currentRow.id});
        this.loading = false;
        
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }

        if (res.data.success) {
            this.$message({
                type: 'success',
                message: `将"${this.currentRow.title}"设置为关于页面`,
            });
        } else {
            this.$message({
                type: 'error',
                message: '设置失败',
            });
        }
        await this.getTableData();
    }
}
</script>

<style>
.article-table-btn-group {
    margin: 1em 0;
}
</style>
