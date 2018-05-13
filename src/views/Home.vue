<template>
    <my-page title="本地文件" :page="page">
        <div class="tool-box">
            <div class="left">
                <ui-raised-button class="btn-new" label="新建" primary ref="button" @click="toggleMenu"/>
                <ui-popover :trigger="trigger" :open="menuVisible" @close="handleClose">
                    <ui-menu>
                        <ui-menu-item title="文本文件" @click="newFile" />
                    </ui-menu>
                </ui-popover>
                <ui-raised-button class="file-select-btn" label="上传文件" secondary>
                    <!-- <input type="file" class="ui-file-button" accept="image/*" @change="fileChange($event)"> -->
                    <input type="file" class="ui-file-button" @change="fileChange($event)">
                </ui-raised-button>
            </div>
            <div class="right">
            </div>
        </div>
        <ul class="my-file-list">
            <li class="item" v-for="file, index in files" :key="file.id">
                <div class="link"
                    @click="selectFile(file)">
                    <img class="icon" :src="iconUrl(file.name)">
                    <div class="info">
                        <div class="name">{{ file.name }}</div>
                        <div class="size">{{ file.size | size }}</div>
                    </div>
                </div>
                <ui-icon-menu
                    class="more"
                    icon="more_vert"
                    :anchorOrigin="{horizontal: 'right', vertical: 'top'}"
                    :targetOrigin="{horizontal: 'right', vertical: 'top'}"
                    @click.prevent="asd = 0"
                    >
                    <ui-menu-item title="重命名" @click.prevent="rename(file)" />
                    <ui-menu-item title="下载" @click.prevent="download(file)" />
                    <ui-menu-item title="删除" @click.prevent="removeFile(index)" />
                    <ui-menu-item title="属性" @click.prevent="viewAttribute(file)" />
                </ui-icon-menu>
                <!-- <a class="remove" href="#" @click.prevent="removeFile(index)">删除</a> -->
                <!-- <a class="download" href="#" @click.prevent="download(file)">下载</a> -->
                <!-- <a class="edit" href="#" @click.prevent="edit(file)">编辑</a> -->
            </li>
        </ul>
        <ui-dialog :open="dialog" title="保存文件" @close="close">
            <ui-text-field v-model="fileName" />
            <ui-flat-button slot="actions" @click="close" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="save" label="确定"/>
        </ui-dialog>
        <ui-dialog :open="renameVisible" title="重命名" @close="toggleRename">
            <ui-text-field v-model="newName" />
            <ui-flat-button slot="actions" @click="toggleRename" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="renameOK" label="确定"/>
        </ui-dialog>
        <ui-drawer class="viewer-box" right :docked="false" :open="ViewerVisible" @close="toggle()">
            <ui-appbar :title="viewedFile.name" v-if="viewedFile">
                <ui-icon-button icon="close" slot="left" @click="toggle()" />
                <ui-icon-button icon="all_inclusive" slot="right" @click="openWith()" title="用其他应用打开" />
            </ui-appbar>
            <div class="body" v-if="viewedFile">
                <pre v-if="viewedFile.type.match(/^text/)">{{ viewedFile.data }}</pre>
                <img :src="viewedFile.data" v-else-if="viewedFile.type.match(/^image/)">
                <div v-else>不支持的文件类型</div>
            </div>
        </ui-drawer>
        <ui-drawer class="attr-box" right :docked="false" :open="attrVisible" @close="toggleAttr()">
            <ui-appbar title="属性">
                <ui-icon-button icon="close" slot="left" @click="toggleAttr" />
            </ui-appbar>
            <div class="body" v-if="viewedFile">
                <ul>
                    <li class="item">
                        <span class="key">文件名：</span>
                        <span class="value">{{ viewedFile.name }}</span>
                    </li>
                    <li class="item">
                        <span class="key">类型：</span>
                        <span class="value">{{ viewedFile.type }}</span>
                    </li>
                    <li class="item">
                        <span class="key">打开方式：</span>
                        <span class="value"></span>
                    </li>
                    <ui-divider />
                    <li class="item">
                        <span class="key">位置：</span>
                        <span class="value">{{ viewedFile.path }}</span>
                    </li>
                    <li class="item">
                        <span class="key">大小：</span>
                        <span class="value">{{ viewedFile.size || size }}</span>
                    </li>
                    <ui-divider />
                    <li class="item">
                        <span class="key">创建时间：</span>
                        <span class="value"></span>
                    </li>
                    <li class="item">
                        <span class="key">修改时间：</span>
                        <span class="value"></span>
                    </li>
                    <li class="item">
                        <span class="key">访问时间：</span>
                        <span class="value"></span>
                    </li>
                    <ui-divider />
                    <li class="item">
                        <span class="key">来源：</span>
                        <span class="value"></span>
                    </li>
                </ul>
            </div>
        </ui-drawer>
        <ui-dialog class="new-box" :open="newVisible" title="新建文本文件" @close="toggleNew">
            <ui-text-field v-model="newFileName" />
            <ui-flat-button slot="actions" @click="toggleNew" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click.nactive="newOk" label="确定"/>
        </ui-dialog>
        <!-- <h1>文件</h1>
        <router-link to="/files">本地文件列表</router-link>
        <router-link to="/files2">网络文件列表</router-link> -->
    </my-page>
</template>

<script>
    const saveAs = window.saveAs
    const Intent = window.Intent
    const localforage = window.localforage

    export default {
        data () {
            return {
                isPick: false,
                fileName: '',
                dialog: false,
                files: [
                ],
                renameVisible: false,
                newName: '',
                attrVisible: false,
                viewedFile: null,
                ViewerVisible: false,
                menuVisible: false,
                trigger: null,
                newVisible: false,
                newFileName: '',
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
            this.trigger = this.$refs.button.$el
        },
        filters: {
            size(value) {
                if (!value) {
                    return ''
                }
                return value + 'B'
            }
        },
        methods: {
            async newOk() {
                this.newVisible = false
                this.files.unshift({
                    type: 'text/plain',
                    name: this.newFileName,
                    data: '',
                    size: 0
                })
                await localforage.setItem('files', this.files)
            },
            toggleNew() {
                this.newVisible = !this.newVisible
            },
            newFile() {
                this.menuVisible = false
                this.newVisible = true
            },
            toggleMenu () {
                this.menuVisible = !this.menuVisible
            },
            handleClose (e) {
                this.menuVisible = false
            },
            toggleAttr() {
                this.attrVisible = !this.attrVisible
            },
            goggleRename() {
                this.renameVisible = !this.renameVisible
            },
            async renameOK() {
                this.renameVisible = false
                this.renameFile.name = this.newName
                await localforage.setItem('files', this.files)
            },
            rename(file) {
                this.renameFile = file
                this.newName = file.name
                this.renameVisible = true
            },
            toggle () {
                this.ViewerVisible = !this.ViewerVisible
            },
            async init() {
                this.files = await localforage.getItem('files')
                if (!this.files) {
                    this.files = [
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
                    ]
                }
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
                } else if (window.intent.data) {
                    if (window.intent.type.includes('text/')) {
                        this.saveText(window.intent.data)
                    } else if (window.intent.type.includes('image/')) {
                        this.saveImage(window.intent.data)
                    }
                    let owner = window.opener || window.parent
                    owner.window.close()
                }
            },
            saveText(text) {
                this.dialog = true
                this.fileName = window.intent.action.extras.fileName || ''
                this.data = text
            },
            saveImage(text) {
                this.dialog = true
                // 123.png
                this.fileName = window.intent.action.extras.fileName || ''
                this.data = text
            },
            filechange (e) {
                this.input = e.target
                if (!e.target.files.length) {
                    return
                }
                this.myfile = e.target.files[0]
                console.log('上传')
                console.log(this.myfile)
                let fr = new FileReader()
                fr.onloadend = async e => {
                    this.files.unshift({
                        type: this.myfile.type,
                        name: this.myfile.name,
                        data: e.target.result,
                        size: this.myfile.size
                    })
                    await localforage.setItem('files', this.files)
                }
                if (this.myfile.type.match(/^image/)) {
                    fr.readAsDataURL(this.myfile)
                } else {
                    fr.readAsText(this.myfile)
                }
            },
            selectFile(file) {
                if (window.intent) {
                    window.intent.postResult(file.data, {
                        fileName: file.name
                    })
                    setTimeout(() => {
                        let owner = window.opener || window.parent
                        owner.window.close()
                    }, 100)
                } else {
                    this.ViewerVisible = true
                    this.viewedFile = file
                    // let extension = this.getFileExtension(fileName)
                    // if (file.type === 'text') {
                    // }
                }
            },
            openWith() {
                if (this.viewedFile.type.match(/^text/)) {
                    let intent = new Intent({
                        action: 'http://webintent.yunser.com/?',
                        type: 'text/*',
                        data: this.viewedFile.data
                    })
                    navigator.startActivity(intent, async data => {
                        if (data) {
                            this.viewedFile.data = data
                            await localforage.setItem('files', this.files)
                        }
                        console.log('成功了')
                    }, data => {
                        console.log('失败')
                    })
                } else if (this.viewedFile.type.match(/^image/)) {
                    let intent = new Intent({
                        action: 'http://webintent.yunser.com/?',
                        type: 'image/*',
                        data: this.viewedFile.data
                    })
                    navigator.startActivity(intent, async data => {
                        if (data) {
                            this.viewedFile.data = data
                            await localforage.setItem('files', this.files)
                        }
                        console.log('成功了')
                    }, data => {
                        console.log('失败')
                    })
                } else {
                    let intent = new Intent({
                        action: 'http://webintent.yunser.com/?',
                        type: '*/*',
                        data: this.viewedFile.data
                    })
                    navigator.startActivity(intent, async data => {
                        if (data) {
                            this.viewedFile.data = data
                            await localforage.setItem('files', this.files)
                        }
                        console.log('成功了')
                    }, data => {
                        console.log('失败')
                    })
                }
            },
            open() {
                this.dialog = true
            },
            close() {
                this.dialog = false
            },
            async save() {
                this.dialog = false
                this.files.unshift({
                    type: 'text',
                    name: this.fileName,
                    data: this.data
                })
                await localforage.setItem('files', this.files)
            },
            viewAttribute(file) {
                this.attrVisible = true
                this.viewedFile = file
            },
            async removeFile(index) {
                this.files.splice(index, 1)
                await localforage.setItem('files', this.files)
            },
            download(file) {
                console.log('download', file)
                if (file.type === 'text') {
                    let f = new File([file.data], {type: 'text/plain;charset=utf-8'})
                    saveAs(f, file.name)
                } else if (file.type === 'image') {
                    window.open(file.data)
                }
            },
            iconUrl(fileName) {
                let extension = this.getFileExtension(fileName)
                let types = ['css', 'doc', 'html', 'jpeg', 'jpg', 'mp3', 'png', 'txt']
                if (types.includes(extension)) {
                    return '/static/icon/' + extension + '.svg'
                } else {
                    return '/static/icon/default.svg'
                }
            },
            getFileExtension(fileName) {
                let arr = fileName.split('.')
                return arr[arr.length - 1]
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../scss/var";

.tool-box {
    margin-bottom: 16px;
    @include clearfix;
    .left {
        float: left;
    }
    .right {
        float: right;
    }
    .btn-new {
        margin-right: 8px;
    }
}

.my-file-list {
    margin-top: 16px;
    max-width: 1000px;
    .item {
        float: left;
        position: relative;
        padding: 16px;
        width: 300px;
        height: 72px;
        margin-right: 16px;
        margin-bottom: 16px;
        // border: 1px solid #eee;
        box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    }
    .link {
        cursor: pointer;
    }
    .icon {
        width: 40px;
        height: 40px;
        margin-right: 8px;
        float: left;
    }
    .info {
        float: left;
    }
    .name {
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // margin-bottom: 8px;
        display: block;
        // line-height: 40px;
    }
    .size {
        color: #ccc;
    }
    .more {
        position: absolute;
        top: 8px;
        right: 8px;
    }
    .remove {
        position: absolute;
        top: 16px;
        right: 16px;
    }
    .download {
        position: absolute;
        top: 16px;
        right: 56px;
    }
    .edit {
        position: absolute;
        top: 16px;
        right: 100px;
    }
}
.viewer-box {
    // width: 400px;
    width: 100%;
    max-width: 800px;
    .body {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
        img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            max-height: 100%;
        }
    }
}
.new-box {
    width: 300px;
}
.attr-box {
    width: 100%;
    max-width: 360px;
    .body {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
    }
    .item {
        margin: 16px 0;
    }
    .key {
        display: inline-block;
        width: 80px;
    }
}
</style>
