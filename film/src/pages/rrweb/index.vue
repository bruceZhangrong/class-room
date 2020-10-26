<template>
  <div class="rrweb-wrapper">
    <div style="text-align: center; margin-bottom: 10px;">
      <img src="../../assets/img/logo.png" alt="logo" width="20%">
    </div>
    <mt-field label="First Name" placeholder="First Name" v-model="form.firstName"></mt-field>
    <mt-field label="Last Name" placeholder="Last Name" v-model="form.lastName"></mt-field>
    <mt-field label="Phone" placeholder="Phone"  v-model="form.phone" :attr="{ maxlength: 11 }"></mt-field>
    <mt-field label="Street" placeholder="Street" v-model="form.street"></mt-field>
    <mt-field label="City" placeholder="City" v-model="form.city"></mt-field>
    <mt-field label="Birth" placeholder="Date of Birth" v-model="form.birth"></mt-field>
    <div style="margin-bottom: 10px;">
      <mt-button @click.native="startRecord" type="primary" size="small">Start Record</mt-button>
      <mt-button @click.native="save" type="primary" size="small">Save</mt-button>
      <mt-button @click.native="stopRecord" type="primary" size="small">Stop</mt-button>
    </div>
    <div style="margin-bottom: 10px;" v-if="recordTime">
      <span style="margin-right: 20px;">开始时间：{{ recordTime }}</span>
      <span>已录制：{{ recordTimes }} s</span>
    </div>
    <mt-button @click.native="$router.push('/screen-record')" type="primary" size="small">Records</mt-button>
    <img src="../../assets/img/home.png" width="100%" alt="">
  </div>
</template>

<script>
import { postSaveScreenRecord } from '../../api/index'
import { Field, Button } from 'mint-ui'
import * as rrweb from 'rrweb'
import moment from 'moment'

export default {
  components: {
    mtField: Field,
    mtButton: Button
  },
  data () {
    return {
      form: {
        firstName: '',
        lastName: '',
        phone: '',
        street: '',
        city: '',
        birth: ''
      },
      allEvents: [],
      timer: null,
      speed: 30000,
      stopRecordFn: null,
      recordTime: '',
      recordTimes: 0
    }
  },
  watch: {
    // allEvents (val) {
    //   val.length === 100 && this.saveEvents(val)
    // }
  },
  methods: {
    startRecord () {
      const _this = this
      this.stopRecordFn = rrweb.record({
        emit (event) {
          _this.allEvents.push(event)
        }
      })
      this.recordTime = moment().format('hh:mm:ss')
      this.recordtTimer = setInterval(() => {
        this.recordTime = moment().format('hh:mm:ss')
        this.recordTimes++
      }, 1000)
      // this.timer = setInterval(() => {
      //   this.saveEvents(this.allEvents)
      //   this.allEvents = []
      // }, this.speed)
    },
    stopRecord () {
      this.stopRecordFn && this.stopRecordFn()
      clearInterval(this.recordtTimer)
      this.recordTimes = 0
    },
    save () {
      this.saveEvents(this.allEvents)
    },
    saveEvents (arr) {
      this.allEvents = []
      const time = moment().format('YYYY-MM-DD HH:mm:ss')
      const str = JSON.stringify(arr)
      localStorage.setItem(`${time}`, str)
      postSaveScreenRecord({
        createTime: time,
        content: str
      })
    }
  },
  mounted () {
    
  },
  destroyed () {
    this.stopRecordFn && this.stopRecordFn()
    // clearInterval(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
  .rrweb-wrapper
    padding: 20px
    font-size: 14px
    max-width 1200px
    margin-left auto
    margin-right auto
    .mint-cell
      box-shadow: 0 0 5px #cecece
      margin-bottom: 20px
</style>
