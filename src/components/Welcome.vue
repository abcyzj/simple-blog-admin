<template>
    <div class="welcome-container">
        <h2>欢迎来到Simple Blog后台管理系统</h2>
        <p>当前用户:{{$store.state.username}}</p>
        <p>用户类型:{{$store.state.role}}</p>
    </div>
</template>

<style>
.welcome-container {
    text-align: center;
}
</style>
