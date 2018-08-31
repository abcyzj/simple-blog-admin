<template>
    <div class="category-table-container">
        <el-table :data="tableData" stripe v-loading="loading" max-height="400">
            <el-table-column prop="name" label="名称" sortable></el-table-column>
            <el-table-column prop="articleNumber" label="文章数" sortable></el-table-column>
            <el-table-column prop="viewNumber" label="阅读量" sortable></el-table-column>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="onEdit(scope.row)" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDelete(scope.row)" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="category-btn-group">
            <el-button type="primary" icon="el-icon-plus" @click="onAddCategory">新增类别</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import { MessageBoxData } from 'element-ui/types/message-box';
import axios from 'axios';
import {showNetworkError} from '@/utils/popup';

@Component
export default class Category extends Vue {
    private tableData: any[] = [];
    private loading: boolean = false;

    private async mounted() {
        await this.requestTableData();
    }

    private async requestTableData() {
        this.loading = true;
        const res = await axios.get(`/api/categoryTable`);
        this.loading = false;
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            return;
        }
        this.tableData = res.data;
    }

    private async onEdit(row: any) {
        let res: MessageBoxData;
        try {
            res = await this.$prompt('输入新的类别名称', '编辑类别', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: row.name,
            });
        } catch (__) {
            this.showCancelMessage();
            return;
        }

        this.loading = true;
        const response = await axios.post('/api/setCategoryName', {id: row.id, name: res.value});
        if (response.status !== 200) {
            showNetworkError();
            this.loading = false;
            return;
        } else if (!response.data.success) {
            this.$message({
                type: 'error',
                message: '修改失败',
            });
            this.loading = false;
            return;
        }

        if (this.checkRepeatedName(res.value)) {
            this.loading = false;
            return;
        }

        row.name = res.value;
        this.loading = false;
        this.$message({
            type: 'success',
            message: '修改成功',
        });
    }

    private async onDelete(row: any) {
        try {
            await this.$confirm(`此操作将永久删除"${row.name}"，是否继续？`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            });
        } catch (__) {
            this.showCancelMessage();
            return;
        }

        this.loading = true;
        const res = await axios.post('/api/deleteCategory', {id: row.id});
        if (res.status !== 200 && res.status !== 401) {
            showNetworkError();
            this.loading = false;
            return;
        } else if (!res.data.success) {
            this.$message({
                type: 'error',
                message: '删除失败',
            });
            this.loading = false;
            return;
        }

        this.tableData.splice(this.tableData.findIndex((item) => item.id === row.id));
        this.loading = false;
        this.$message({
            type: 'success',
            message: `已删除"${row.name}"`,
        });
    }

    private async onAddCategory() {
        let res: MessageBoxData;
        try {
            res = await this.$prompt('请输入类别名称', '新增类别', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{1,4}$/,
                inputErrorMessage: '类别名称长度应在1~4',
            });
        } catch (__) {
            this.showCancelMessage();
            return;
        }

        if (this.checkRepeatedName(res.value)) {
            return;
        }

        this.loading = true;
        const response = await axios.post('/api/addCategory', {name: res.value});
        if (response.status !== 200) {
            showNetworkError();
            this.loading = false;
            return;
        } else if (!response.data.success) {
            this.$message({
                type: 'error',
                message: '添加失败',
            });
            this.loading = false;
            return;
        }
        this.loading = false;
        this.$message({
            type: 'success',
            message: `添加"${res.value}"成功`,
        });
        await this.requestTableData();
    }

    private checkRepeatedName(name: string) {
        for (const row of this.tableData) {
            if (row.name === name) {
                this.$message({
                    type: 'error',
                    message: `已有名为"${name}"的类别`,
                });
                return true;
            }
        }
        return false;
    }

    private showCancelMessage() {
        this.$message({
            type: 'info',
            message: '已取消',
        });
    }
}
</script>

<style>
.category-btn-group {
    margin: 1em 0;
}
</style>
