<template>
    <my-page title="我的文件">
        <div class="common-container container">
            <input id="file" type="file" name="logo" class="from-control">
            <button @click="upload">上传</button>

            <a href="javascript:;" v-if="!$store.state.user" @click="login">点击登陆</a>
            <!-- <input type="file" value="上传文件" @change="filechange($event)"> -->
            <div v-if="!files.length">没有任何文件</div>
            <ui-list v-if="files.length">
                <ui-list-item :title="file.name" describeText="Jan 9, 2014" 
                    v-for="file in files" :key="file.id">
                    <ui-icon-menu slot="right" icon="more_vert" tooltip="操作">
                        <ui-menu-item title="打开" @click="open(file)" />
                        <!-- <ui-menu-item title="复制" /> -->
                        <ui-menu-item title="删除" @click="remove(file)" />
                    </ui-icon-menu>
                </ui-list-item>
            </ui-list>
        </div>
        
        <ui-dialog title="确认删除" :open="dialog">
            确认删除文件
            <ui-flat-button slot="actions" @click="dialog = false" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="removeFile" label="确定"/>
        </ui-dialog>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import oss from '@/util/oss'
    import {domain} from '@/config'

    export default {
        data () {
            return {
                dialog: false,
                files: []
            }
        },
        mounted() {
            if (!this.$store.state.user) {
                // this.login()
            }
            this.init()
        },
        methods: {
            login() {
                location.href = oss.getOauthUrl()
            },
            init() {
                this.refresh()
            },
            open(file) {
                window.open(file.url)
            },
            refresh() {
                let userId = this.$storage.get('user').id

                this.$http.get(`/cloud/files`)
                    .then(response => {
                        let data = response.data
                        console.log(data)
                        this.files = data
                    },
                    response => {
                        console.log(response)
                    })
            },
            upload() {
                let file = document.getElementById('file').files[0]
                const MB = 1024 * 1024
                console.log(file.size, 10 * MB)
                if (file.size > 10 * MB) {
                    this.$message({
                        type: 'danger',
                        text: '文件大小不能大于 10 MB'
                    })
                    return
                }
                this.loading = true
                let param = new FormData()
                param.append('logo', file, file.name)
                param.append('chunk', '0')
                console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };  //添加请求头
                this.$http.post('/net/files',param,config)
                    .then(response => {
                        console.log('上传成功')
                        console.log(response.data.data.path);
                        this.$http.post('/cloud/files', {
                            path: response.data.data.path
                        })
                            .then(response => {
                                console.log('上传成功')
                                this.refresh()
                            })  
                    })        
            },
            removeFile() {
                this.dialog = false
                this.$http.delete(`/cloud/files/${this.removeFileId}`)
                    .then(response => {
                        let data = response.data
                        console.log(data)
                        this.refresh()
                    },
                    response => {
                        console.log(response)
                        alert('删除失败') // Toast
                    })
            },
            remove(file) {
                this.dialog = true
                this.removeFileId = file.id
            },
            filechange (e) {
                this.input = e.target
                if (!e.target.files.length) {
                    return
                }
                this.myfile = e.target.files[0]

                console.log('上传')
                console.log(this.myfile.name)

                let param = new FormData()
                param.append('file', this.myfile, this.myfile.name)
                param.append('chunk', '0')
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                this.$http.post(domain.imgApi + '/files', param, config)
                    .then(response => {
                        this.refresh()
                    })

                /*
                 // 上传文件类型检测
                 let ext = this.fileExt(this.myfile.name)
                 if (this.type === 'image') {
                 if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png' && ext !== 'gif' && ext !== 'bmp') {
                 this.error('只能上传图片文件！')
                 return
                 }
                 }
                 */
                console.log('file', this.myfile.type)
//                if (this.myfile.type.indexOf('image') !== -1) {
//                    if (this.myfile.size / 100 > 500) {
//                        this.compressAndUpload()
//                        return
//                    }
//                }
            }
        }
    }
</script>

<style scoped>
</style>
