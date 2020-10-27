<template>
  <div class="rrweb-wrapper">
    <template v-if="isScreenOne">
      <div style="text-align: center; margin-bottom: 10px;">
        <img src="../../assets/img/logo.png" alt="logo" width="20%">
      </div>
      <mt-field label="First Name" placeholder="First Name" v-model="form.firstName"></mt-field>
      <mt-field label="Last Name" placeholder="Last Name" v-model="form.lastName"></mt-field>
      <mt-field label="Phone" placeholder="Phone"   v-model="form.phone" :attr="{ maxlength: 11, class: 'rr-ignore mint-field-core' }"></mt-field>
      <mt-field label="Street" placeholder="Street" v-model="form.street"></mt-field>
      <mt-field label="City" placeholder="City" class="rr-block" v-model="form.city"></mt-field>
      <mt-field label="Birth" placeholder="Date of Birth" v-model="form.birth" :attr="{ maxlength: 11, class: 'rr-block mint-field-core' }"></mt-field>
      <mt-field label="Weight" placeholder="Weight" v-model="form.weight" :attr="{ type: 'number' }"></mt-field>
    </template>
    <template v-else>
      <mt-button @click.native="calculateOrder(1)" type="primary" size="small" class="btn">1</mt-button>
      <mt-button @click.native="calculateOrder(2)" type="primary" size="small" class="btn">2</mt-button>
      <mt-button @click.native="calculateOrder(3)" type="primary" size="small" class="btn">3</mt-button>
      <mt-button @click.native="calculateOrder(4)" type="primary" size="small" class="btn">4</mt-button>
      <!-- <mt-button @click.native="showClickOrder = true" type="primary" size="small" class="btn">点击顺序</mt-button> -->
      <span>点击顺序: {{ btnClickOrder.join(',') }}</span>
    </template>

    <mt-switch v-model="scenes" style="margin-top: 20px;">{{ scenesName }}</mt-switch>

    <div style="margin-bottom: 10px; margin-top: 20px">
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
import { Field, Button, Switch, MessageBox } from 'mint-ui'
import * as rrweb from 'rrweb'
import moment from 'moment'

export default {
  name: 'record',
  components: {
    mtField: Field,
    mtButton: Button,
    mtSwitch: Switch
  },
  data () {
    return {
      form: {
        firstName: '',
        lastName: '',
        phone: '',
        street: '',
        city: '',
        birth: '',
        weight: ''
      },
      scenes: false,
      isScreenOne: true,
      // allEvents: [],
      allEvents: [[]],
      timer: null,
      speed: 30000,
      stopRecordFn: null,
      recordTime: '',
      recordTimes: 0,
      scenesName: 1,
      btnClickOrder: [],
      showClickOrder: false
    }
  },
  watch: {
    scenes (val) {
      this.isScreenOne = !val
      this.scenesName = !val ? 1 : 2
    }
    // allEvents (val) {
    //   val.length === 100 && this.saveEvents(val)
    // }
  },
  methods: {
    calculateOrder (num) {
      // const prev = this.btnClickOrder.length > 0 ? this.btnClickOrder.length - 1 : ''
      const size = this.btnClickOrder.filter(v => v === num)
      if (this.btnClickOrder.length >= 8) {
        this.show.erorr = false
      } else if (size.length >= 2) {
        MessageBox('Error', `点击 ${num} 超过 3 次`)
      } else {
        this.btnClickOrder.push(num)
      }
    },
    startRecord () {
      const _this = this
      this.stopRecordFn = rrweb.record({
        // emit (event, isCheckout) {
        //   _this.allEvents.push(event)
        // },
        // maskInputOptions: {
        //   number: true
        // },
        packFn: rrweb.pack,
        // maskAllInputs: true,
        emit (event, isCheckout) {
          isCheckout && _this.allEvents.push([])
          _this.allEvents[_this.allEvents.length - 1].push(event)
        },
        checkoutEveryNth: 200
        // checkoutEveryNms: 5 * 60 * 1000
      })
      // console.log(this.stopRecordFn)
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
      this.allEvents = [[]]
      const time = moment().format('YYYY-MM-DD HH:mm:ss')
      const len = arr.length
      console.log(arr)
      const events = len > 1 && arr[0].length ? [...arr[len - 2], ...arr[len - 1]] : (arr[0].length ? arr[0] : arr)
      const str = JSON.stringify(events)
      localStorage.setItem(`${time}`, str)
      postSaveScreenRecord({
        createTime: time,
        content: str
      })
    },
    errorHandler (vm) {
      vm.stopRecordFn && vm.save()
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

    .btn
      display block
      margin-bottom 10px
</style>
