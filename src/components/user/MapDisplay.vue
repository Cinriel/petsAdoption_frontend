<template>
  <div >
    <el-dialog title="地址" :visible.sync="dialogFormVisible" append-to-body>
      <div id="container"></div>
      <el-form label-position="left">
        <br>
        <el-form-item label="地址" label-width="50px">
          <el-input v-model="address" autocomplete="off" id='address_input'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="returnAddress">确 定</el-button>
      </div>
    </el-dialog>

    <el-button type="text" @click="openAddressChoice">{{textDisp}}</el-button>

  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  props:["textDisp"],
  name:"MapDisplay",
  data(){
    return{
      map:"",      // 地图对象
      marker:"",  //点标记对象
      address:'',
      dialogFormVisible: false
    }
  },
  methods:{
    initMap(centerLon, CenterLat){
      AMapLoader.load({
        key:"0990590973239ab05ac67fab2c3ab09c",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins:['AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.Geolocation'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        
      }).then((AMap)=>{
        this.map = new AMap.Map("container",{  //设置地图容器id
          viewMode:"2D",    //是否为3D地图模式
          zoom:13,           //初始化地图级别
          center:[centerLon,CenterLat], //初始化地图中心点位置

        });
        
        // 添加插件
        this.map.on('click', this.showInfoClick);
        this.map.addControl(new AMap.Scale())
        this.map.addControl(new AMap.ToolBar())
        this.map.addControl(new AMap.HawkEye())        
        // 初始化添加一个marker
        this.marker = new AMap.Marker({
          icon: "/img/poi-marker-default.png",
          position: [centerLon, CenterLat],
          offset: new AMap.Pixel(-10, -25)
        });
        this.map.add(this.marker)
        fetch(`https://restapi.amap.com/v3/geocode/regeo?output=json&location=${centerLon+","+CenterLat}&key=0e9a34009d1a70bd97993c42be0e05b9&radius=1000&extensions=all`)
        .then(response => response.json())
        .then(res => {
          this.address = res.regeocode.formatted_address
        });
      }).catch(e=>{
        console.log(e);
      })
    },
    showInfoClick(e){
        this.marker.setMap(null);
        this.marker = new AMap.Marker({
          icon: "/img/poi-marker-default.png",
          position: [e.lnglat.getLng(),e.lnglat.getLat()],
          offset: new AMap.Pixel(-10, -25),
          // // 设置拖拽效果         
          // draggable: true,
          // cursor: 'move',
          // raiseOnDrag: true
        });
        this.map.add(this.marker)

        fetch(`https://restapi.amap.com/v3/geocode/regeo?output=json&location=${e.lnglat.getLng()+','+e.lnglat.getLat()}&key=0e9a34009d1a70bd97993c42be0e05b9&radius=1000&extensions=all`)
        .then(response => response.json())
        .then(res => {
          this.address = res.regeocode.formatted_address
        });
    },
    openAddressChoice(){
      navigator.geolocation.getCurrentPosition( position=>{ 
        let latitude = position.coords.latitude;//获取纬度
        let longitude = position.coords.longitude;//获取经度
        this.dialogFormVisible = true
        console.log();
        this.initMap(longitude,latitude);

      },function geoError(event) { 
        this.$message.error("请求错误，信息:"+event.message)
      });
      
    },
    returnAddress(){
      this.$emit("choiceAddressFinish",this.address)
      this.dialogFormVisible = false
    }
  },
}
</script>

<style  scoped>
  #container{
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 400px;
  }
  .amap-container img{
    width: 20px;
    height: 30px;
  }
  .amap-marker>.amap-icon{
    text-align: left;
  }
</style>