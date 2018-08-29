<template>
    <el-menu class="navbar" mode="horizontal">
        <Breadcrumb/>
        <el-dropdown trigger="hover" class="account-dropdown">
            <span class="dropdown-link">
                账户
                <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <router-link to="/modifyPassword">
                    <el-dropdown-item>
                        修改密码
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item @click.native="logout">
                    退出
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import Breadcrumb from './Breadcrumb.vue';

@Component({
    components: {
        Breadcrumb,
    },
})
export default class NavBar extends Vue {
    private async logout() {
        console.log('hei');
        await this.$store.dispatch('logout');
        this.$router.push('/login');
        location.reload();
    }
}
</script>

<style>
.navbar {
    height: 50px;
    width: 100%;
    display: block;
    line-height: 50px;
    border-bottom: solid 1px #e6e6e6;
}

.account-dropdown.el-dropdown {
    display: inline-block;
    position: absolute;
    right: 40px;
}
</style>
