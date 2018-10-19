<template>
  <div>
    <el-dialog title="用户管理" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :rules="rules" ref="form" :model="userInfo" label-width="80px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="userInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="userInfo.author"></el-input>
        </el-form-item>
        <el-form-item label="页数">
          <el-input v-model="userInfo.pageviews"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="userInfo.status">
            <el-radio label="published">发布</el-radio>
            <el-radio label="deleted">删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="userInfo.display_time" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="last-item-position">
          <el-button @click="cancelDialog('form')">取 消</el-button>
          <el-button type="primary" @click="saveInfo('form')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import clearObject  from '@/utils/clear-object' // 验权

export default {
  props: {
    item: Object,
    dialogVisible: Boolean
  },
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
        ]
      },
      objData: {
        title:'',
        author:'',
        pageviews:'',
        status:'published',
        display_time:'2000-01-01'
      }
    }
  },
  computed: {
    userInfo: function() {
      if(this.item.title!=undefined && this.item.title!=''){
         return this.objData=Object.assign({}, this.item)
      }
        return this.objData
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.cancelDialog('form')
        })
        .catch(_ => {})
    },
    saveInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var info = Object.assign({}, this.userInfo)
          this.$emit('save-info', info)
        } else {
          return false
        }
      })
    },
    cancelDialog(formName) {
      this.$refs[formName].resetFields()
      this.userInfo=clearObject(this.userInfo)
      this.$emit('close-dialog')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.last-item-position {
  text-align: right;
}
</style>

