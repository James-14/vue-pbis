<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option v-for="item in dataStatus" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
        <el-button type="primary" @click="addInfo">添加</el-button>
        <el-button type="text" :icon="searchIcon" @click="adSearch">高级搜索</el-button>
      </el-form-item>
      <template v-if="seen">
        <el-form-item label="日期">
          <el-date-picker class="input-date-class" key="startDate" v-model="formInline.startDate" type="date" placeholder="选择日期">
          </el-date-picker>&nbsp;&nbsp;-&nbsp;&nbsp;
          <el-date-picker class="input-date-class" key="endDate"  v-model="formInline.endDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="吃啥">
          <el-radio-group v-model="formInline.radio2">
            <el-radio :label="3">烧饼</el-radio>
            <el-radio :label="6">包子</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="Title">
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.title"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编辑" width="130">
        <template slot-scope="scope">
          <!-- <el-button v-show='!scope.row.edit' type="primary" @click='scope.row.edit=true' size="small" icon="edit">编辑</el-button>
          <el-button v-show='scope.row.edit' type="success" @click='scope.row.edit=false' size="small" icon="check">完成</el-button> -->
          <el-row>
            <el-button type="text" icon='el-icon-edit' @click='updateRow(scope.$index, scope.row)' size="small">编辑2</el-button>
            <el-button type="text" icon='el-icon-delete' @click='deleteRow(scope.$index, scope.row)' size="small">删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-position">
      <el-pagination :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <edit :dialog-visible='dialogVisible' :item='editRow' v-on:close-dialog="dialogVisible = false" v-on:save-info="saveInfo" />
  </div>
</template>

<script>
import { getList } from '@/api/table'
import { getDictionary } from '@/api/dictionary'
import edit from './edit'

export default {
  components: {
    edit
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      eidtIndex: -1,
      editRow: {},
      total: 50,
      currentPage: 1,
      seen: false,
      dataStatus:[],
      searchIcon: 'el-icon-arrow-down',
      formInline: {
        user: '',
        region: '',
        radio2: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDictionary('area').then(response => {
        this.dataStatus = response.dictList;
        getList(this.listQuery).then(response => {
        response.items[0].edit = false
        response.items[1].edit = false
        this.list = response.items
        this.listLoading = false
      })
      })      
    },
    updateRow(index, row) {
      this.dialogVisible = true
      this.eidtIndex = index
      this.editRow = row
    },
    saveInfo: function(userInfo) {
      if (this.eidtIndex != -1) {
        this.list.splice(this.eidtIndex, 1, userInfo)
      } else {
        this.list.push(userInfo)
      }
      console.log(this.list[0].title)
    },
    addInfo: function() {
      this.eidtIndex = -1
      this.editRow = {}
      this.dialogVisible = true
    },
    deleteRow(index, row) {
      this.list.splice(index, 1)
    },
    closeDialog() {
      this.dialogVisible = false
    },
    onSubmit() {
      console.log(this.formInline.radio2)
      console.log(this.formInline.region)
      console.log(this.formInline.startDate)
      console.log(this.formInline.endDate)
      console.log('submit!')
    },
    adSearch() {
      this.seen = !this.seen
      this.searchIcon = this.seen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.page-position {
  margin-top: 20px;
  text-align: center;
}
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.input-date-class{
    width: 140px;
}
</style>

   