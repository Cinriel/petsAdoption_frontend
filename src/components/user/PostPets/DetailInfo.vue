<template>
  <div>
    <el-form :model="detailPetsForm" :rules="rules" ref="detailPetsForm" label-width="100px" class="demo-ruleForm">
      <el-form-item 
        v-for="template in petsDetailTemplate"
        :key="template.id"
        :required="template.required"
        :label="template.label"
      >
        <el-input 
          v-if="template.type=='text'" 
          type="text"
          v-model="detailPetsForm.detailInfo[template.label]" 
          :placeholder="template.example"
          autocomplete="off"
          :prop='template.label'
          ></el-input>

        <el-checkbox-group  v-if='template.type=="checkbox"' v-model="detailPetsForm.detailInfo[template.label]" :required='detailPetsForm.required'>
          <!-- :name="detailPetsForm.label" -->
          <el-checkbox 
            v-for="checkBoxItem in template.options"
            :key="checkBoxItem"
            :label="checkBoxItem"            
            ></el-checkbox>
        </el-checkbox-group>

        <el-radio-group v-if='template.type=="radio"' v-model="detailPetsForm.detailInfo[template.label]" :required='detailPetsForm.required'>
          <el-radio 
            v-for="radioValue in template.options"
            :key="radioValue"
            :label="radioValue"></el-radio>

        </el-radio-group>
        
      </el-form-item>

      <el-form-item label="领养费" prop="money">
        <el-input
          style="width:200px"
          placeholder="请输入领养费"
          v-model="detailPetsForm.money">
          <i slot="prefix" class="iconfont icon-moneybag"></i>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      <el-form-item label="运费" prop="freight" >
        <el-input
          style="width:200px"
          placeholder="请输入运费"
          v-model="detailPetsForm.freight">
          <i slot="prefix" class="iconfont icon-Express_transportation"></i>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>

      
      <!-- 图片 -->
      <el-form-item label="图片信息" prop="images">
        <el-upload
          id="imgUpload"
          action="http://localhost:8001/api/file/uploadImg"
          list-type="picture-card"
          :with-credentials='true'
          :on-remove="handleRemove"
          :on-success='handleUploadSuccess'
          :on-preview="handlePictureCardPreview"
          :show-file-list='true'
          ref='iamges'
          name='imgFile'
          >
          <i slot="default" class="el-icon-plus"></i>
          
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="描述" prop="catDesc">
        <el-input type="textarea" v-model="detailPetsForm.catDesc" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button style="margin-top: 12px;" @click="prev">上一步</el-button>
        <el-button style="margin-top: 12px;" @click="resetForm('detailPetsForm')">重置</el-button>
        <el-button style="margin-top: 12px;" @click="next('detailPetsForm')">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name:"detailInfo",
  data(){
    return{
      detailPetsForm:{
        catDesc: '',
        images:[],
        detailInfo:{
          饲料:[],
        },
        money:'',
        freight:''
      },
      rules:{
        images:[
          { type: 'array', required: true, message: '请至少选择一张照片', trigger: 'change' }
        ],
        catDesc:[
          { required: true, message: '请输入宠物介绍', trigger: 'blur' },
          { min: 10, message: '长度在 10 个字符以上', trigger: 'blur' }
        ],
        money:[
          { required: true, message: '请输入领养费', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        freight:[
          { required: true, message: '请输入运费', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ]
      },
      petsDetailTemplate:[
        // {"label":"颜色",example:'红色',required:true | false,type:'chechbox'}
      ],
  
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
    }
  },
  
  methods:{
    ...mapActions('PostPetsOptions',['updateRuleForm']),
    // 下一步
    next(formName) {
      // 所有信息填完确认提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 上传vuex
          this.updateRuleForm(this.detailPetsForm)
          // 跳转路由
          this.$router.push({name:'allInfo'})
          // active改变
          this.$store.state.PostPetsOptions.active=2
        } else {
          this.$message.error("请检查信息完整");
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs['iamges'].clearFiles()
    },
    // 上一步
    prev(){
      this.$store.state.PostPetsOptions.active=0
      this.$router.push({name:'baseInfo'})
    },
    handleRemove(file) {
      let deletedImgUrl = file.response.data
      this.detailPetsForm.images = this.detailPetsForm.images.filter(item=>{return item!= deletedImgUrl})
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.response.data;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    handleUploadSuccess(response){
      this.$message.success("上传成功")
      this.detailPetsForm.images.push(response.data)
    },
  },
  activated(){
    // 更新品种、种类信息
    let kinds = this.$store.state.PostPetsOptions.PetsForm.kinds
    let category = this.$store.state.PostPetsOptions.PetsForm.category
    this.$axios.get(`/api/pets/getTemplate?kind=${kinds}&category=${category}`).then(res=>{
      console.log(res);
      this.petsDetailTemplate = []
      res.data.data.forEach(element => {
        let templateInfo = {
          id: element.id,
          label: element.character, // 标签：颜色、体重。。。
          type: element.type,   // text, number, checkbox, radio
          options:element.options.split(','),  // 选项
          required: element.required == 1,  // 是否为必要的
          example: element.example,   //例子
          unit: element.unit // 单位，当type为number时需要
          }
        this.petsDetailTemplate.push(templateInfo)
      });
      console.log(this.petsDetailTemplate);
    })
  }
}
</script>

<style scoped>
@import url('../../../assets/post_pet_icon/iconfont.css');
.el-form{
  text-align: left;
}
#imgUpload>>>input[type="file"]{
  display: none;
}
.iconfont{
  font-size: 25px;
  line-height: 40px;
}
</style>