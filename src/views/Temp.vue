<template>
    <my-page title="临时网盘" :page="page">
        <form action="http://localhost:1026/net/files" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <input id="file" type="file" name="logo" class="from-control">
            </div>
            <div class="tip">文件大小不能超过 10M，如需上传更大到文件，请联系管理员</div>
          
            <ui-raised-button class="btn" label="上传" primary @click="upload" />
            <div class="ui-loading" v-if="loading">
                <ui-circular-progress :size="24"/>
            </div>
            <div v-if="result">
                {{ result }}
                <br>
                <ui-raised-button class="btn" label="复制链接" :data-clipboard-text="result" />
            </div>
        </form>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import {domain} from '@/config'
    const ClipboardJS = window.ClipboardJS

    export default {
        data () {
            return {
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
        },
        methods: {
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
                  let param = new FormData(); //创建form对象
                  param.append('logo',file,file.name);//通过append向form对象添加数据
                  param.append('chunk','0');//添加form表单中其他数据
                  console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
                  let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                  };  //添加请求头
                  this.$http.post(domain.imgApi + '/net/files',param,config)
                  .then(response=>{
                    console.log(response.data);
                    this.result = domain.imgApi + response.data.data.path.replace('public', '')
                    this.loading = false
                  })        
            }
        }
    }
</script>

<style scoped>
    .tip {
        margin: 16px 0;
        color: #999;
    }
    .btn {
        margin-top: 16px;
        margin-bottom: 16px;
    }
</style>
