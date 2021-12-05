<template>
    <div>
        <el-row>
            <el-col :span="12">
                <el-input type="textarea" v-model="oldStr" clear placeholder="请输入"></el-input>
            </el-col>
            <el-col :span="12">
                <el-input type="textarea" v-model="newStr" clear placeholder="请输入"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <code-diff :old-string="oldStr" :new-string="newStr" outputFormat="side-by-side"/>
        </el-row>
    </div>
</template>

<script>
    import CodeDiff from "vue-code-diff";
    export default {
        name: "codeDiffComponent",
        components: { CodeDiff },
        data() {
            return {
                oldStr: "",
                newStr: ""
            };
        }
    }
</script>

<style scoped>
    >>> .el-textarea__inner {
        height: 200px;
        width: 100%;
    }
</style>
