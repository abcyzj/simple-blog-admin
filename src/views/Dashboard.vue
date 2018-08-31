<template>
    <el-container class="dashboard-container">
        <el-aside width="150px"><SideBar basePath="/"/></el-aside>
        <el-container>
            <el-header :style="{padding: 0}">
                <NavBar/>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/SideBar.vue';

@Component({
    components: {
        NavBar,
        SideBar,
    },
})
export default class Dashboard extends Vue {
    private async mounted() {
        try {
            await this.$store.dispatch('getUserInfo');
        } catch (err) {
            this.$message({
                type: 'error',
                message: '网络错误',
            });
        }
    }
}
</script>

<style>
.dashboard-container {
    height: 100%;
}
</style>
