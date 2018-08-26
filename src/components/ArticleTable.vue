<template>
    <div class="article-table-container">
        <el-table ref="articleTable" :data="tableData" stripe :loading="loading">
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="date" label="修改日期" sortable></el-table-column>
            <el-table-column prop="viewNumber" label="阅读量" sortable></el-table-column>
            <el-table-column prop="category" label="类别" :filters="filters" :filter-method="filterMethod"></el-table-column>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="onEdit(scope.$index)" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDelete(scope.$index)" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="article-table-btn-group">
            <el-button type="primary" icon="el-icon-plus">新文章</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import { setTimeout } from 'timers';

@Component
export default class ArticleTable extends Vue {
    private tableData: any[] = [
        {
            title: '你好',
            date: new Date(2018, 7, 5).toString(),
            viewNumber: 20,
            category: '某有',
        },
        {
            title: '我草',
            date: new Date(2018, 8, 4).toString(),
            viewNumber: 30,
            category: '邮码',
        },
    ];
    private loading: boolean = true;

    private filters: any[] = [];

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

    private filterMethod(value: string, row: any) {
        return value === row.category;
    }

    private created() {
        //TODO get data
        this.onTableDataChange();
    }

    private onEdit(index: number) {
        //TODO
    }

    private onDelete(index: number) {
        //TODO
    }
}
</script>

<style>
.article-table-btn-group {
    margin: 1em 0;
}
</style>

