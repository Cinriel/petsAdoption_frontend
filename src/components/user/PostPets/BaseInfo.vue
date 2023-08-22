<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="标题" prop="title">
      <el-input v-model="ruleForm['title']" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label='种类' prop="kinds">
      <el-radio-group v-model="ruleForm['kinds']">
        <el-radio 
          :label="kind"
          v-for="kind in kindsList"
          :key="kind"
        >
          {{kind}}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label='品种' prop="category">
      <el-select v-model="ruleForm['category']" clearable filterable placeholder="请选择">
        <el-option
          v-for="category in categoryList"
          :key="category"
          :label="category"
          :value="category"
        >
        </el-option>
      </el-select>
    </el-form-item>


    <el-form-item label="重量" prop="weight">
      <el-input style="width:200px"  v-model="ruleForm['weight']" autocomplete="off" type="number" min="0.00" step="0.01">
        <template slot="append">kg</template>
      </el-input>
    </el-form-item>

    <el-form-item label="身高" prop="height">
      <el-input style="width:200px"  v-model="ruleForm['height']" autocomplete="off" type="number" min="0.00" step="0.01">
        <template slot="append">cm</template>
      </el-input>
    </el-form-item>

    <el-form-item label="数量" prop="number">
      <el-input style="width:200px" v-model.number="ruleForm['number']" autocomplete="off">
         <template slot="append">只</template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button style="margin-top: 12px;" @click="resetForm('ruleForm')">重置</el-button>
      <el-button style="margin-top: 12px;" @click="next('ruleForm')">下一步</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.imgDisp{
  text-align: left;
  display: flex;
}
.el-form-item{
  text-align: left;
}

</style>

<script>
  export default {
    name:"PostPets",
    data() {
      return {
        ruleForm: {
          title: '',
          weight: '',
          number: '',
          kinds: '',
          height:'',
          category: '',
          petsId:'', // 由系统填写
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          weight: [
            {required: true, message: '请输入体重', trigger: 'blur' },
          ],
          height: [
            {required: true, message: '请输入身高', trigger: 'blur' },
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'blur' },
            {type:'number', message: '请输入数字'},
            {pattern:/^[1-9][0-9]{0,3}$/  , message: '范围在0-9999'}
          ],
          number: [
            {required: true, message: '请输入所拥有数量', trigger: 'blur' },
            {type:'number', message: '请输入数字'},
            {pattern: /^[1-9][0-9]{0,2}$/, message: '范围在0-999',trigger: 'blur'}
          ],
          kinds: [
            { required: true, message: '请输入宠物种类', trigger: 'blur' }
          ],
          category:[
            { required: true, message: '请输入宠物种类', trigger: 'blur' }
          ]
        },
        kindsList:[],
        categoryList:[]
      };
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      hanldeUploadSuccess(response){
        console.log(response);
        if(response.flag){
          // 保证只有一张照片
          if(this.fileList.length > 0){
            let url = this.fileList.pop().url
            this.deleteImg(url)
          }
          this.$message.success("上传成功")
          this.ruleForm.imgUrl = response.data
          let name = response.data.split('/').pop()
          this.fileList.push({name:name, url: response.data})
        }
        else{
          this.$message.error("服务器繁忙，请稍后子再试")
        }
      },
      handlerRemoveFile(file){
        let url = file.response.data
        this.deleteImg(url)
      },
      deleteImg(url){
        this.$axios.delete('/api/file/deleteFile?url='+url).then(res=>{
          if(res.data.flag){
            this.$message.success("删除成功")
          }else{
            this.$message.error("删除失败")
          }
        })
      },
      next(formName) {
      // 所有信息填完确认提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 上传vuex
            this.$store.dispatch("PostPetsOptions/updateRuleForm",this.ruleForm)
            // active变化
            this.$store.state.PostPetsOptions.active = 1
            // 跳转路由
            this.$router.push({name:'detailInfo', params: { kinds:this.ruleForm.category, category:this.ruleForm.category }})
          } else {
            this.$message.error("请检查信息完整");
            return false;
          }
        });
      },
      hanldeKindCategoryChange(value){
        console.log(value);
      }
    },
    watch:{
      'ruleForm.kinds'(newValue){
        this.$axios.get("/api/pets/getCategory?kind="+newValue).then(res=>{
          this.categoryList = res.data.data
        })
      },
      'ruleForm.category'(val){
        this.$axios.get(`/api/pets/getIdByKindsAndCategory?kind=${this.ruleForm.kinds}&category=${val}`)
          .then(res=>{
            console.log(res.data.data);
            this.ruleForm.petsId = res.data.data
          })
      }
    },
    mounted(){
      this.$axios.get("/api/pets/getKinds").then(res=>{
        this.kindsList = res.data.data
      })
    },
  }
</script>