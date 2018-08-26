<template>
    <div class="category-table-container">
        <el-table :data="tableData" stripe v-loading="loading" max-height="400">
            <el-table-column prop="name" label="名称" sortable></el-table-column>
            <el-table-column prop="articleNumber" label="文章数" sortable></el-table-column>
            <el-table-column prop="viewNumber" label="阅读量" sortable></el-table-column>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="onEdit(scope.$index)" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDelete(scope.$index)" icon="el-icon-delete">删除</el-button>
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

@Component
export default class Category extends Vue {
    private tableData: any[] = [];
    private loading: boolean = false;

    private created() {
        this.tableData = [
            {
                name: '哈哈',
                articleNumber: 10,
                viewNumber: 50000,
            },
            {
                name: '可惜',
                articleNumber: 80,
                viewNumber: 40000,
            }
        ];
    }
    
    private async onEdit(index: number) {
        let res: MessageBoxData;
        try {
            res = await this.$prompt('输入新的类别名称', '编辑类别', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.tableData[index].name,
            });
        } catch(__) {
            this.showCancelMessage();
            return;
        }

        //TODO
        this.$message({
            type: 'success',
            message: '修改成功',
        });
    }

    private async onDelete(index: number) {
        try {
            await this.$confirm(`此操作将永久删除"${this.tableData[index].name}"，是否继续？`, '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            });
        } catch(__) {
            this.showCancelMessage();
            return;
        }

        //TODO
        this.$message({
            type: 'success',
            message: `已删除"${this.tableData[index].name}"`,
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
        } catch(__) {
            this.showCancelMessage();
            return;
        }

        if (!this.checkRepeatedName(res.value)) {
            return;
        }

        //TODO
        this.$message({
            type: 'success',
            message: `添加"${res.value}"成功`,
        });
    }

    private checkRepeatedName(name: string) {
        for (let row of this.tableData) {
            if (row.name === name) {
                return true;
            }
        }

        this.$message({
            type: 'error',
            message: `已有名为"${name}的类别"`,
        })
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
