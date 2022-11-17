<template>
  <div >
    <!-- 没有内容时展示 -->
      <div v-if='!petsData.length'>
        <el-empty description="什么也没找到" :image-size="300"></el-empty>
      </div>
    
    <div class="cloumnDisplay" >
      <div v-for="item in petsData" :key="item.index" >
        <PetsItem 
          :id='item.id' 
          :img_url='item.image' 
          :title='item.title' 
          :owner='item.owner' 
          :variety="item.category"
        />
      </div>
    </div>

  </div>
</template>

<script>
import {mapState} from 'vuex'
import PetsItem from './PetsItem.vue'
export default {
name: 'PetsView',
components: {
    PetsItem
  },
  data() {
    return {
      currentPage: 1,
    }
  },
  computed:{
    ...mapState('PetsOption',['petsData','total'])
  },
  methods: {
  },
  mounted(){
  }
}
</script>

<style>
.cloumnDisplay{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.cloumnDisplay>div{
  width: 25rem;
  margin-right: 20px;
  margin-bottom: 20px;
}

</style>