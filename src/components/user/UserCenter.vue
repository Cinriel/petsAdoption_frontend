<template>
  <div>
    <div style="background-color: #fcfcfc; font-family: '宋体'; height: 100%">
      <h3>
       个人中心
      </h3>
      <div style="margin-top: 25px; margin-left: 20px">
        <el-row :gutter="10">
          <el-col :span="2">
            <div
              style="
                background-color: #ffebcd;
                width: 60px;
                height: 60px;
                display: inline-block;
                border-radius: 50%;
                overflow: hidden;
              "
            >
              <el-popconfirm
                confirm-button-text='确认'
                cancel-button-text='不用了'
                icon="el-icon-info"
                icon-color="green"
                title="修改头像？"
                @confirm="changeProfile()"
              >
                <el-image slot="reference" :src="user.profile" style="width: 60px; height: 60px"></el-image>
              </el-popconfirm>
            </div>
            <div style="margin-top: 50px; margin-left: 1px">
              <el-button
                type="text"
                style="font-size: 15px; color: #4d4d4d"
              >
                个人信息
              </el-button>
            </div>

            <div style="margin-top: 5px; margin-left: 1px">
              <el-button
                type="text"
                style="font-size: 15px; color: #4d4d4d"
                @click="dialogFormVisible=true"
              >
                修改信息
                <span
                    style="color: #b0e0e6"
                >
              </span>
              </el-button>
            </div>
          </el-col>

          <el-col :span="21">
            
            <el-row>
              <el-col>
                <el-descriptions :title="user.username" border>
                  <el-descriptions-item label="账号">{{user.uid}}</el-descriptions-item>
                  <el-descriptions-item label="用户名">{{user.username}}</el-descriptions-item>
                  <el-descriptions-item label="手机号">{{user.phone}}</el-descriptions-item>
                  <el-descriptions-item label="居住地">{{user.address}}</el-descriptions-item>
                  <el-descriptions-item label="性别">{{user.gender}}</el-descriptions-item>
                  <el-descriptions-item label="邮箱">{{user.email}}</el-descriptions-item>
                  <el-descriptions-item label="余额">{{user.money}}￥</el-descriptions-item>
                  <el-descriptions-item label="爱心指数">
                    <el-rate
                      v-model="user.caringIndex"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}">
                    </el-rate>
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
            <!-- 个人信息 -->
            <el-row>
              <el-card style="margin-top: 30px; height:500px; overflow: scroll;">
                <el-row>
                   <el-col>
                      <el-timeline>
                        <el-timeline-item 
                          :timestamp="address.is_default == 1? '默认地址' : `收货地址` " 
                          placement="top" 
                          v-for="address in userShoppingAddress" 
                          :key="address.id">
                          <el-card>
                              <div>
                                <span>
                                  <span style="font-family:'宋体';font-size:15px;">
                                    <strong>{{address.name}}</strong>
                                  </span>
                                  <span style="font-family:'宋体';font-size:12px;margin-left:20px;">
                                    <span>{{address.telephone}}</span>
                                  </span>
                                </span>
                              </div>
                              <div>
                                <span>{{address.address}}</span> &nbsp; &nbsp;
                                <a href="javascript:void(0)" v-if="address.is_default != 1">删除</a> &nbsp;
                                <a href="javascript:void(0)" v-if="address.is_default != 1">设为默认</a>
                              </div>
                          </el-card>
                        </el-timeline-item>

                        <el-timeline-item timestamp="添加地址" placement="top">
                          <el-card>
                            <el-dialog
                              title="提示"
                              :visible.sync="dialogAddAddress"
                              width="40%"
                            >
                              <el-form :rules="shoppingAddressInfoRules" ref="shoppingAddressInfo" :model="shoppingAddressInfo" label-width="80px">
                                <!-- 收货人名称 -->
                                <el-form-item label="收货人名称" prop="username">
                                  <el-input type="text" v-model="shoppingAddressInfo.username"></el-input>
                                </el-form-item>
                                <!-- 收货人手机号 -->
                                <el-form-item label="收货人电话" prop="phoneNumber">
                                  <el-input type="text" v-model="shoppingAddressInfo.phoneNumber"></el-input>
                                </el-form-item>
                                <!-- 地址选择 -->
                                <el-form-item label="收货人地址" prop="address">
                                  <AddressSelector ref="CascaderSelector" :getAddress='receiveAddress'/>
                                </el-form-item>
                              </el-form>
                              <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="addNewAddressInfo">确 定</el-button>
                              </div>
                              
                            </el-dialog>
                            <button @click="dialogAddAddress=true">添加地址</button>
                          </el-card>
                        </el-timeline-item>
                      </el-timeline>
                    </el-col>
                </el-row>
              </el-card>
            </el-row>
            <!-- 修改密码 -->
          </el-col>
        </el-row>
      </div>

      <div></div>
    </div>

    <!-- 修改信息 -->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" style="text-align:left">
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 性别 -->
        <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 地址 -->
        <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
          <el-col :span="20"> 
            <el-input :disabled="true" v-model="form.address" autocomplete="off"></el-input>
          </el-col>
          <el-col :span='4'>
            <MapDisplay @choiceAddressFinish='getUserLiveAddress' textDisp='选择地址'/>
          </el-col>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input
            type="email"
            v-model="form.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 生日 -->
        <el-form-item
          label="生日"
          :label-width="formLabelWidth"
          prop="birthday"
        >
          <el-date-picker
            v-model="form.birthday"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('form')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <!-- 改头像 -->
    <el-dialog
      title="请上传头像"
      :visible.sync="dialogChangeProfileVisible"
      width="30%"
    >
      <el-upload
        class="upload-demo"
        drag
        name='imgFile'
        action="http://localhost:8001/api/file/upload"
        with-credentials
        :on-success='handleChangeProdileSuccess'
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import AddressSelector from '../AddressSelector.vue'
import MapDisplay from './MapDisplay.vue'
import {mapActions} from 'vuex'
export default {
  name: "UserCenter",
  components:{
    AddressSelector,MapDisplay
  },
  data() {
    return {
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      
      // 表单验证
      rules: {
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入正确的手机号码或者座机号",
          },
        ],
        birthday: [
          {
            type: "date",
            required: true,
            message: "输入生日",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        address: [
          { required: true, message: "请输入居住地址", trigger: "blur" },
        ],
      },

      // 用户表单信息(修改信息时候用)
      form: {
        gender: "",
        phone: "",
        address: "",
        email: "",
        birthday: "",
        uid:'',
      },
      // 收货地址相关
      shoppingAddressInfo:{
        username:"",
        phoneNumber:'',
        addressId:"",   // id+详细地址
        detailAddress:""
      },
      shoppingAddressInfoRules:{
        username: [
          { required: true, message: '请输入收货人名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请输入正确的手机号码'
          }
        ],
        address:[
          { validator: this.validateAddress, trigger: 'blur' },
        ]
      },

      // 用户信息(展示用户的信息)
      user: {
        username: "张三",
        uid: 1242342353,
        profile: "https://tse1-mm.cn.bing.net/th/id/OIP-C.wr-AIOnqYMh_HlhEu1X97wHaNL?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
        gender: "男",
        address: "12",
        phone: "124",
        email: "3423",
        caringIndex: 3.9,
        // 收货地址
        shoppingAddress:[]
      },

      userShoppingAddress:[],

      dialogAddAddress:false,
      dialogFormVisible: false, // 信息修改框
      dialogChangeProfileVisible: false, // 头像修改框
      formLabelWidth: "120px", // update框宽度
      getLocationLoding: false,  // 获取位置加载中
    };
  },
  methods: {
    ...mapActions('globalOptions',['loadingStatus']),
    submitInfo() {
      this.dialogFormVisible = false;
      console.log("submit");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingStatus(true)
          console.log(this.form);
          // 发数据
          this.$axios
            .put("/api/user/update",this.form)
            .then((res) => {
              if (res.data.flag) {
                // 提交成功
                this.$message.success("提交成功");
                this.loadUser()
              } else {
                // 处理失败
                this.$message.error("服务器出错");
              }
              this.loadingStatus(false)

            })
            .catch((err) => {
              // 网络失败回调
              this.$message.error("网络出错了");
              console.log(err);
              this.loadingStatus(false)
            });
          
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 休眠
    sleep(delay) {
      new Promise((resolve) => setTimeout(resolve, delay));
    },
    // 获取位置
    getLocation(){
      let that = this
      let successCallback=()=>{
        if(navigator.geolocation) {
          if(navigator.geolocation.getCurrentPosition){
            this.getLocationLoding = true
            navigator.geolocation.getCurrentPosition(
                function (position) {  
                  let lat = position.coords.latitude
                  let lon = position.coords.longitude
                  
                  fetch(
                    `https://restapi.amap.com/v3/geocode/regeo?key=0e9a34009d1a70bd97993c42be0e05b9&location=${lon},${lat}&poitype=&radius=1000&extensions=all&batch=false&roadlevel=0`,
                    {
                      method: 'get'
                    }
                  ).then(async res=>{
                    res = await res.json()
                    let location = res.regeocode.formatted_address
                    console.log(location);
                    that.form.address = location
                    that.getLocationLoding = false
                  })
                    
                },
                function (e) {
                  throw(e.message);
                }
            )
          }
        }
      }

      let errorCallback = ()=>{
        this.$confirm('请授权该网站获取地理位的权限', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'ok!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'ok'
          });          
        });
      }
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      
    },
    // 改头像
    changeProfile(){
      this.dialogChangeProfileVisible = true
      
    },
    // 加载用户
    loadUser(){
      this.$axios.get(`/api/user/getUserFromUid`).then(res=>{
        if(res.data.flag){
          this.user = res.data.data
          this.loadingStatus(false)
        }else{
          this.$message.error("服务器出错，请稍后再试")
          this.loadingStatus(false)
        }
      }).catch((error)=>{
        this.$message.error("服务器出错，请稍后尝试",error)
        this.loadingStatus(false)

      })
    },
    // 改头像失败回调
    handleChangeProdileSuccess(response){
      this.dialogChangeProfileVisible = false

      this.$axios.put("/api/user/update",{'profile':response.data}).then(res=>{
        if(res.data.flag){
          this.$message.success("上传成功")
          this.loadUser()
        }else{
          this.$message.error("上传失败")
        }
      })
    },
    // 
    getUserLiveAddress(address){
      // todo 修改为原来的
      console.log(address);
      this.form.address=address;
      // this.form.addressId = address.id
      // this.form.detailAddress = address.formattedAddress
    },
    // 获取地址选择器返回的地址信息
    receiveAddress(address){
      this.shoppingAddressInfo.addressId = address.id
      this.shoppingAddressInfo.detailAddress = address.detailAddress
      console.log(address);
    },

    // 添加新地址(地址、手机号、收货人名字)
    addNewAddressInfo(){
      this.$refs['shoppingAddressInfo'].validate((valid) => {
          if (valid) {
            console.log(this.shoppingAddressInfo);
            let data={
              "regionId":this.shoppingAddressInfo.addressId,
              "detailAddress": this.shoppingAddressInfo.detailAddress,
              "username":this.shoppingAddressInfo.username,
              "phone": this.shoppingAddressInfo.phoneNumber,
              "isDefault":"0"
            }
            this.$axios.post("/api/shopping_address/addAddress",data).then(res=>{
              if(res.data.flag){
                // 提交成功
                this.$message.success(res.data.message);
                this.dialogAddAddress = false
                // 刷新地址
                this.getUserAddress()
              }else{
                this.$message.error(res.data.message);
              }
            })
          } else {
            this.$message.error("请检查表单");
            return false;
          }
        });
    },
    // 检验地址有效性
    validateAddress(rule, value, callback){
      if (!this.shoppingAddressInfo.addressId) {
        callback(new Error('请选择地区'));
      } else if(!this.shoppingAddressInfo.detailAddress){
        callback(new Error('请填写详细地址'));
      }else{
        callback();
      }
    },
    
    // 获取用户收货地址
    async getUserAddress(){
      let res = await this.$axios.get("/api/shopping_address/getAllAddress")
      if(res.data.flag){
        this.$set(this.user,'shoppingAddress',[])
        // console.log(res.data.data);
        res.data.data.forEach(element => {
          let temp = {}
          temp['name'] = element['username']
          temp['telephone'] = element['phone']
          temp['id'] =  element['id']
          let address = element.extendField.formattedAddress.replaceAll(",","/");
          temp['address'] = address;
          temp['is_default'] = element['isDefault'];
          if(element['isDefault'] == 1){
            // 添加到第一位
            this.userShoppingAddress.unshift(temp)
          }else{
            this.userShoppingAddress.push(temp);
          }
        });
      }else{
        this.$message.error(res.data.message);
      }      
    }
   
  },
  mounted() {
    // 发送请求获取用户信息
    this.loadingStatus(true)
    this.loadUser()
    this.getUserAddress()
  },  
};
</script>

<style>
.errorTip {
  float: left;
  color: red;
  font-size: 15px;
  margin-left: 100px;
}

.el-timeline{
  text-align: left;
}
</style>