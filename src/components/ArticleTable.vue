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
                    <el-button size="mini" @click="onEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDelete(scope.row)" icon="el-icon-delete">删除</el-button>
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
        for (const data of this.tableData) {
            if (this.filters.findIndex((item, ind, obj) => item.value === data.categoryName) === -1) {
                this.filters.push({
                    text: data.categoryName,
                    value: data.categoryName,
                });
            }
        }
    }

    private async mounted() {
        await this.getTableData();
    }

    private onEdit(row: any) {
        this.$router.push({name: 'editArticle', params: {articleId: row.id}});
    }

    private async onDelete(row: any) {
        try {
            await this.$confirm(`此操作将永久删除"${row.title}"，是否继续？`, '警告', {
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
        const res = await axios.post('/api/deleteArticle', {id: row.id});
        this.loading = false;
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }

        if (res.data.success) {
            this.$message({
                type: 'success',
                message: `已删除"${row.title}"`,
            });
        } else {
            this.$message({
                type: 'error',
                message: `删除"${row.title}失败"`,
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
