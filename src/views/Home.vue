<template>
    <ui-page name="home">
        <ui-header></ui-header>
        <main class="page-body">
            <ui-container>
                <div class="container">
                    <h1>文件</h1>
                    <router-link to="/files">本地文件列表</router-link>
                    <router-link to="/files2">网络文件列表</router-link>
                    <router-link to="/about">关于</router-link>
                </div>
            </ui-container>
        </main>
        <ui-footer></ui-footer>
    </ui-page>
</template>

<script>
    import UiContainer from "../../node_modules/yunser-ui-vue/src/components/container/container";
    export default {
        components: {UiContainer},
        data () {
            return {
            }
        }
    }
</script>

<style scoped>
</style>
