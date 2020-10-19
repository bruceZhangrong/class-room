<template>
  <div class="rrweb-wrapper">
    <mt-field label="First Name" placeholder="First Name" v-model="form.firstName"></mt-field>
    <mt-field label="Last Name" placeholder="Last Name" v-model="form.lastName"></mt-field>
    <mt-field label="Phone" placeholder="Phone"  v-model="form.phone" :attr="{ maxlength: 11 }"></mt-field>
  </div>
</template>

<script>
import { postSaveScreenRecord } from '../../api/index'
import { Field } from 'mint-ui'
import * as rrweb from 'rrweb'
import moment from 'moment'

export default {
  components: {
    mtField: Field
  },
  data () {
    return {
      form: {
        firstName: '',
        lastName: '',
        phone: ''
      },
      allEvents: []
    }
  },
  watch: {
    allEvents (val) {
      val.length >= 50 && this.saveEvents(val)
    }
  },
  methods: {
    saveEvents (arr) {
      this.allEvents = []
      postSaveScreenRecord({
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        content: JSON.stringify(arr)
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
    })
  },
  destroyed () {

  }
}
</script>

<style lang="stylus" scoped>
  .rrweb-wrapper
    padding: 20px
    font-size: 14px
    .mint-cell
      box-shadow: 0 0 5px #cecece
      margin-bottom: 20px
</style>
