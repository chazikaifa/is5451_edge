<template>
  <el-container>
    <el-main class="container">
      <div class="title">Records</div>
      <el-table
        class="table" 
        :data="records" 
        border
        :header-cell-style="{textAlign:'center'}"
        :cell-style="{textAlign:'center'}"
        v-loading = "record_loading != distinct_list.length"
        size="small"> 
        <el-table-column label="deviceName" prop="deviceName"></el-table-column>
        <el-table-column label="distinct" prop="distinct"></el-table-column>
        <el-table-column label="from" prop="from"></el-table-column>
        <el-table-column label="hop" prop="hop"></el-table-column>
        <el-table-column label="temperature" prop="temperature"></el-table-column>
        <el-table-column label="fever">
          <template #default="scope">
            <div>{{scope.row.temperature > 38?'Y':'N'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="intruder" prop="intruder"></el-table-column>
        <el-table-column label="timestamp" prop="timestamp"></el-table-column>
      </el-table>

      <div class="title">Events</div>
      <el-table
        class="table" 
        :data="events" 
        border
        :header-cell-style="{textAlign:'center'}"
        :cell-style="{textAlign:'center'}"
        v-loading = "event_loading != distinct_list.length"
        size="small"> 
        <el-table-column label="deviceName" prop="deviceName"></el-table-column>
        <el-table-column label="distinct" prop="distinct"></el-table-column>
        <el-table-column label="event" prop="event"></el-table-column>
        <el-table-column label="timestamp" prop="timestamp"></el-table-column>
      </el-table>

    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios'
import {Check,Close} from '@element-plus/icons-vue'
export default {
  name: 'HelloWorld',
  components:{
    Close,
    Check
  },
  props: {
  },
  created:function(){
    this.init()
    setInterval(this.init,10000)
  },
  data(){
    return {
      distinct_list:[
        {baseUrl:'http://0.0.0.0:5000/',distinct:100},
      ],
      records:[],
      events:[],
      warnings:[],
      record_loading:0,
      event_loading:0,
      warn_loading:0,
      Check:Check,
      Close:Close
    }
  },
  methods:{
    init:function(){
      this.record_loading = 0
      this.event_loading = 0
      this.warn_loading = 0
      this.records = []
      this.events = []
      this.warnings = []
      let global_flag = 0

      this.distinct_list.forEach(d=>{
        this.request(d.baseUrl+'api/record',res=>{
          let records = res.data.records == undefined?[]:res.data.records
          records.forEach(r=>{
            r.from = d.distinct
            if(r.distinct == d.distinct){
              r.intruder = 'N'
            }else{
              r.intruder = 'Y'
            }
            this.records.push(r)
          })
          this.records.sort(function(a,b){
            return b.timestamp - a.timestamp
          })
          this.record_loading = this.record_loading + 1
        })
        this.request(d.baseUrl+'api/event',res=>{
          this.events = this.events.concat(res.data.events == undefined?[]:res.data.events)
          this.event_loading = this.event_loading + 1
        })
        this.request(d.baseUrl+'api/warning',res=>{
          let warn = res.data.warnings == undefined?[]:res.data.warnings
          warn.forEach(w=>{
            if(w.type == 'global'){
              if(global_flag == 0){
                w.distinct = '-'
                this.warnings.push(w)
                global_flag = 1
              }
            }else{
              w.distinct = d.distinct
              this.warnings.push(w)
            }
          })
          this.warn_loading = this.warn_loading + 1
          this.warnings.sort(function(a,b){
            if(a.type == 'global'){
              return -1
            }
            if(b.type == 'global'){
              return 1
            }
            return a.distinct - b.distinct
          })
        })
      })
    },
    setWarning:function(type,distinct,s){
      this.warn_loading = 0
      this.distinct_list.forEach(d=>{
        if(type == 'local' && distinct != d.distinct){
          this.warn_loading = this.warn_loading + 1
          return
        }
        this.request(d.baseUrl+'api/setWarning?t='+type+'&s='+s,res=>{
        this.$message.success('[distinct:'+d.distinct+']'+res.data.status)
        this.warn_loading = this.warn_loading + 1
        if(this.warn_loading == this.distinct_list.length){
          this.init()
          }
        })
      })
      
    },
    request:function(url,callback){
      axios.get(url)
      .then((res)=>{
        if(callback){
          callback(res)
        }
      }).catch((e)=>{
        this.$message.error(e.message)
        console.log(e)
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  height:100vh;
  width:100vh;
  overflow-y:auto;
  overflow-x: hidden;
}
.title{
  width: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  color: #000
}
.table{
  margin-top: 5px;
  margin-bottom: 40px;
}
</style>
