<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-input type="textarea" class="json-viewer" v-model="jsonStr" clear placeholder="请输入json字符串" @input="textareaHandler"></el-input>
            </el-col>
            <el-col :span="12">
                <json-viewer :value="jsonData" class="json-viewer" :expand-depth=5 copyable></json-viewer>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import JsonViewer from 'vue-json-viewer'
    import 'vue-json-viewer/style.css'

    export default {
        name: "JsonViewerComponent",
        components: {JsonViewer},
        data() {
            return {
                jsonStr: '',
                jsonData: {}
            }
        },
        methods: {
            textareaHandler() {
                this.jsonData = JSON.parse(this.jsonStr);
            }
        }
    }
</script>

<style scoped>
    >>> .el-textarea__inner, .json-viewer {
        min-height: calc(100vh - 50px) !important;
        width: 100%;
    }
</style>
