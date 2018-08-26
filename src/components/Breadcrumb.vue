<template>
    <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) of levelList" v-if="item.meta.title" :key="item.path">
            <span v-if="index === levelList.length - 1">{{ item.meta.title }}</span>
            <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import { RouteRecord } from 'vue-router';

@Component
export default class Breadcrumb extends Vue {
    private levelList: RouteRecord[] = [];

    @Watch('$route')
    private onRouteChanged() {
        this.getLevelList();
    }

    private getLevelList() {
        this.levelList = this.$route.matched;
        if (this.levelList[0].name === 'dashboard') {
            this.levelList[0].path = '/';
        }
    }

    private created() {
        this.getLevelList();
    }
}
</script>

<style>
.breadcrumb.el-breadcrumb {
    line-height: 50px;
    margin-left: 10px;
    outline: none;
    display: inline-block;
}
</style>
