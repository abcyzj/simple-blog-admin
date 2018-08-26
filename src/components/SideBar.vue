<template>
    <div class="sidebar-container">
        <el-menu router>
            <el-menu-item v-for="route in routes" v-if="!route.meta.hidden" :key="route.name" :index="resolvePath(route.path)">
                <span class="menu-title">{{ route.meta.title }}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {dashboardChildrenRroutes} from '@/router.ts';
import { RouteConfig } from 'vue-router';
import path from 'path';

@Component
export default class SideBar extends Vue {
    @Prop(String) private basePath: string;
    private routes: RouteConfig[] = [];

    private created() {
        this.routes = dashboardChildrenRroutes;
    }

    private resolvePath(childPath: string) {
        console.log(childPath);
        return path.resolve(this.basePath, childPath);
    }
}
</script>

<style>
.sidebar-container {
    width: 100%;
    height: 100%;
    background: rgb(48, 65, 86);
    overflow-x: hidden;
}

.sidebar-container .el-menu {
    width: 100%;
}

.sidebar-container .el-menu-item {
    background: rgb(48, 65, 86);
    color: rgb(191, 203, 217)
}

.sidebar-container .el-menu-item:hover {
    background: rgb(38, 52, 69);
    color: rgb(64, 158, 255);
}

.sidebar-container .el-menu-item:focus {
    background: rgb(38, 52, 69);
    color: rgb(64, 158, 255);
}
</style>
