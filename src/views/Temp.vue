<template>
    <my-page title="临时网盘" :page="page">
        <div class="common-container container">
            <form action="http://localhost:1026/net/files" method="post" enctype="multipart/form-data">
                <div class="form-group">
                    <input id="file" type="file" name="logo" class="from-control">
                </div>
                <div class="tip">文件大小不能超过 10M，如需上传更大的文件，请联系管理员</div>
            
                <ui-raised-button class="btn" label="上传" primary @click="upload" />
                <div class="ui-loading" v-if="loading">
                    <ui-circular-progress :size="24"/>
                </div>
                <div v-if="result">
                    {{ result }}
                    <br>
                    <ui-raised-button class="btn" label="复制链接" :data-clipboard-text="result" />
                    <br>
                    <img class="qrcode" :src="`https://nodeapi.yunser.com/qrcode?content=` + encodeURIComponent(result)">
                </div>
            </form>

            <div class="total">
                从 2019-05-22 开始，
                <br>
                我们为用户免费提供了共
                <span class="value">{{ total | size }}</span>
                的临时文件服务，
                <br>
                目前占用磁盘 {{ use | size }}。
            </div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import {domain} from '@/config'
    const ClipboardJS = window.ClipboardJS

    export default {
        data () {
            return {
                use: 0,
                total: 0,
                loading: false,
                result: null,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/3f29c70009f911e98a041bb7d41b216e',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.initClipboard()
            this.stat()
        },
        methods: {
            stat() {
                this.$http.get('/file/temp/stat')
                    .then(res => {
                        this.total = res.data.total
                        this.use = res.data.use
                    })    
            },
            initClipboard() {
                this.clipboard = new ClipboardJS('.btn')
                this.clipboard.on('success', e => {
                    this.$message({
                        type: 'success',
                        text: '复制成功'
                    })
                    console.info('Action:', e.action);
                    console.info('Text:', e.text);
                    console.info('Trigger:', e.trigger);
                    e.clearSelection();
                })
                this.clipboard.on('error', e => {
                    console.error('Action:', e.action);
                    console.error('Trigger:', e.trigger);
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
                param.append('file', file, file.name)
                console.log(param.get('file'))
                this.$http.post('/file/temp', param,  {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                .then(response => {
                    console.log(response.data);
                    this.result = domain.imgApi + response.data.path.replace('public', '')
                    this.loading = false
                    this.stat()
                })        
            }
        },
        filters: {
            size(value) {
                const KB = 1024
                const MB = 1024 * KB
                const GB = 1024 * MB

                if (value < KB) {
                    return value.toFixed(2) + 'B'
                } else if (value < MB) {
                    return (value / KB).toFixed(2) + 'K'
                } else if (value < GB) {
                    return (value / MB).toFixed(2) + 'M'
                } else {
                    return (value / GB).toFixed(2) + 'G'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tip {
        margin: 16px 0;
        color: #999;
    }
    .btn {
        margin-top: 16px;
        margin-bottom: 16px;
    }
    .qrcode {
        border: 1px solid rgba(0, 0, 0, .12);
    }
    .total {
        line-height: 1.8;
        margin-top: 80px;
        color: #999;
        .value {
            font-size: 24px;
            font-weight: bold;
        }
    }
</style>
