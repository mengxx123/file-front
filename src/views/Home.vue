<template>
    <my-page title="本地文件" :page="page">
        <input type="file" value="上传文件" @change="filechange($event)">
        <ul class="my-file-list">
            <li class="item" v-for="file, index in files"
                @click="selectFile(file)"
                :style="{cursor: isPick ? 'pointer' : 'default'}">
                {{ file.name }}
                <a class="remove" href="#" @click.prevent="removeFile(index)">删除</a>
            </li>
        </ul>
        <ui-dialog :open="dialog" title="保存文本" @close="close">
            <ui-text-field v-model="fileName" />
            <ui-flat-button slot="actions" @click="close" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="save" label="确定"/>
        </ui-dialog>
        <!-- <h1>文件</h1>
        <router-link to="/files">本地文件列表</router-link>
        <router-link to="/files2">网络文件列表</router-link> -->
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                isPick: false,
                fileName: '',
                dialog: false,
                files: [
                ],
                page: {
                    menu: [
                        // {
                        //     type: 'icon',
                        //     icon: 'file_upload',
                        //     click: this.upload,
                        //     title: '上传'
                        // }
                    ]
                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.files = this.$storage.get('files', [
                    {
                        type: 'text',
                        name: '123.txt',
                        data: '121212\n33333'
                    },
                    {
                        type: 'text',
                        name: '123.json',
                        data: '{name: "张三",apge: 12}'
                    },
                    {
                        type: 'image',
                        name: '123.svg',
                        data: 'data:image/svg+xml;base64,PHN2ZyBkYXRhLXYtM2I1N2FkYWM9IiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjgwMCIgaGVpZ2h0PSI1MDAiPjxyZWN0IHg9IjE2IiB5PSIxMjgiIHdpZHRoPSIxNDAiIGhlaWdodD0iNDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiB0aXRsZT0i5qC555uu5b2VIj48L3JlY3Q+PHRleHQgeD0iODYiIHk9IjE0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+5qC555uu5b2VPC90ZXh0PjxyZWN0IHg9IjE4OCIgeT0iMTYiIHdpZHRoPSIxNDAiIGhlaWdodD0iNDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiB0aXRsZT0i56ys5LiAIj48L3JlY3Q+PHRleHQgeD0iMjU4IiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+56ys5LiAPC90ZXh0PjxsaW5lIHgxPSIxNTYiIHkxPSIxNDgiIHgyPSIxNzIiIHkyPSIxNDgiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L2xpbmU+PGxpbmUgeDE9IjE3MiIgeTE9IjE0OCIgeDI9IjE3MiIgeTI9IjM2IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjxsaW5lIHgxPSIxNzIiIHkxPSIzNiIgeDI9IjE4OCIgeTI9IjM2IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjxyZWN0IHg9IjE4OCIgeT0iMTAwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjQwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgdGl0bGU9IuWVhuWTgeS/oeaBr+euoeeQhuaooeWdlyI+PC9yZWN0Pjx0ZXh0IHg9IjI1OCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7llYblk4Hkv6Hmga/nrqHnkIbmqKHlnZc8L3RleHQ+PHJlY3QgeD0iMzYwIiB5PSI3MiIgd2lkdGg9IjE0MCIgaGVpZ2h0PSI0MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIHRpdGxlPSLnrKwxIj48L3JlY3Q+PHRleHQgeD0iNDMwIiB5PSI5MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+56ysMTwvdGV4dD48bGluZSB4MT0iMzI4IiB5MT0iMTIwIiB4Mj0iMzQ0IiB5Mj0iMTIwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjxsaW5lIHgxPSIzNDQiIHkxPSIxMjAiIHgyPSIzNDQiIHkyPSI5MiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT48bGluZSB4MT0iMzQ0IiB5MT0iOTIiIHgyPSIzNjAiIHkyPSI5MiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT48cmVjdCB4PSIzNjAiIHk9IjEyOCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSI0MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIHRpdGxlPSLnrKwyIj48L3JlY3Q+PHRleHQgeD0iNDMwIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPuesrDI8L3RleHQ+PGxpbmUgeDE9IjMyOCIgeTE9IjEyMCIgeDI9IjM0NCIgeTI9IjEyMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT48bGluZSB4MT0iMzQ0IiB5MT0iMTIwIiB4Mj0iMzQ0IiB5Mj0iMTQ4IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjxsaW5lIHgxPSIzNDQiIHkxPSIxNDgiIHgyPSIzNjAiIHkyPSIxNDgiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L2xpbmU+PGxpbmUgeDE9IjE1NiIgeTE9IjE0OCIgeDI9IjE3MiIgeTI9IjE0OCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT48bGluZSB4MT0iMTcyIiB5MT0iMTQ4IiB4Mj0iMTcyIiB5Mj0iMTIwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjxsaW5lIHgxPSIxNzIiIHkxPSIxMjAiIHgyPSIxODgiIHkyPSIxMjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L2xpbmU+PHJlY3QgeD0iMTg4IiB5PSIxODQiIHdpZHRoPSIxNDAiIGhlaWdodD0iNDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiB0aXRsZT0i56ys5LiJIj48L3JlY3Q+PHRleHQgeD0iMjU4IiB5PSIyMDQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPuesrOS4iTwvdGV4dD48bGluZSB4MT0iMTU2IiB5MT0iMTQ4IiB4Mj0iMTcyIiB5Mj0iMTQ4IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjxsaW5lIHgxPSIxNzIiIHkxPSIxNDgiIHgyPSIxNzIiIHkyPSIyMDQiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L2xpbmU+PGxpbmUgeDE9IjE3MiIgeTE9IjIwNCIgeDI9IjE4OCIgeTI9IjIwNCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT48cmVjdCB4PSIxODgiIHk9IjI0MCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSI0MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIHRpdGxlPSLnrKzlm5siPjwvcmVjdD48dGV4dCB4PSIyNTgiIHk9IjI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+56ys5ZubPC90ZXh0PjxsaW5lIHgxPSIxNTYiIHkxPSIxNDgiIHgyPSIxNzIiIHkyPSIxNDgiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L2xpbmU+PGxpbmUgeDE9IjE3MiIgeTE9IjE0OCIgeDI9IjE3MiIgeTI9IjI2MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvbGluZT48bGluZSB4MT0iMTcyIiB5MT0iMjYwIiB4Mj0iMTg4IiB5Mj0iMjYwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9saW5lPjwvc3ZnPg=='
                    }
                ])
                this.initWebIntents()
                this.debug()
            },
            debug() {
                // this.saveText('666666666666666666')
            },
            initWebIntents() {
                if (!window.intent) {
                    return
                }
                console.log(window.intent.data)
                // let data = window.intent.data
                console.log('要处理的数据')
                console.log(window.intent)
                if (window.intent.action.action.includes('save')) {
                    if (window.intent.type.includes('text/')) {
                        this.saveText(window.intent.data)
                    } else if (window.intent.type.includes('image/')) {
                        this.saveImage(window.intent.data)
                    }
                    let owner = window.opener || window.parent
                    owner.window.close()
                } else if (window.intent.action.action.includes('pick')) {
                    this.isPick = true
                }
            },
            saveText(text) {
                this.dialog = true
                this.fileName = window.intent.extras.fileName || ''
                this.data = text
            },
            saveImage(text) {
                this.dialog = true
                this.fileName = '123.png'
                this.data = text
            },
            filechange (e) {
                this.input = e.target
                if (!e.target.files.length) {
                    return
                }
                this.myfile = e.target.files[0]

                console.log('上传')
                console.log(this.myfile.name)
            },
            selectFile(file) {
                window.intent.postResult(file.data)
                setTimeout(() => {
                    let owner = window.opener || window.parent
                    owner.window.close()
                }, 100)
            },
            open() {
                this.dialog = true
            },
            close() {
                this.dialog = false
            },
            save() {
                this.dialog = false
                this.files.unshift({
                    type: 'text',
                    name: this.fileName,
                    data: this.data
                })
                this.$storage.set('files', this.files)
            },
            removeFile(index) {
                this.files.splice(index, 1)
                this.$storage.set('files', this.files)
            }
        }
    }
</script>

<style lang="scss" scoped>
.my-file-list {
    max-width: 400px;
    .item {
        position: relative;
        padding: 16px;
        margin-bottom: 16px;
        border: 1px solid #eee;
        cursor: pointer;
    }
    .remove {
        position: absolute;
        top: 16px;
        right: 16px;
    }
}
</style>
