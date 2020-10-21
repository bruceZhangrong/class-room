<template>
  <div class="rrweb-wrapper">
    <mt-field label="First Name" placeholder="First Name" v-model="form.firstName"></mt-field>
    <mt-field label="Last Name" placeholder="Last Name" v-model="form.lastName"></mt-field>
    <mt-field label="Phone" placeholder="Phone"  v-model="form.phone" :attr="{ maxlength: 11 }"></mt-field>
    <mt-field label="Street" placeholder="Street" v-model="form.street"></mt-field>
    <mt-field label="City" placeholder="City" v-model="form.city"></mt-field>
    <mt-field label="Birth" placeholder="Date of Birth" v-model="form.birth"></mt-field>

    <mt-button @click.native="$router.push('/screen-record')" type="primary">Records</mt-button>
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
      timer: null
    }
  },
  watch: {
    // allEvents (val) {
    //   val.length === 100 && this.saveEvents(val)
    // }
  },
  methods: {
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
    const _this = this
    this.$nextTick(() => {
      rrweb.record({
        emit (event) {
          _this.allEvents.push(event)
        }
      })

      this.timer = setInterval(() => {
        this.saveEvents(this.allEvents)
        this.allEvents = []
      }, 60000)
    })
  },
  destroyed () {
    clearInterval(this.timer)
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
