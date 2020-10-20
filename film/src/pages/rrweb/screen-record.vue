<template>
  <div class="record-wrapper">
    <ul class="record-box">
      <li v-for="(item, index) in list" :key="index" @click="playerRecord(item)">
        <div class="player-icon">
          <img src="../../assets/img/icon-player.svg" alt="Player">
        </div>
        <span>{{ item.createTime }}</span>
      </li>
    </ul>
    <div id="player-wrapper"></div>
  </div>
</template>

<script>
import { getScreenRecord } from '../../api/index'
import RrwebPlayer from 'rrweb-player'

export default {
  components: {
  },
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getRadioList()
  },
  mounted () {

  },
  methods: {
    playerRecord (item) {
      // eslint-disable-next-line no-new
      new RrwebPlayer({
        target: document.querySelector('#player-wrapper'),
        props: {
          events: JSON.parse(item.info),
          width: 500,
          height: 700
        }
      })
    },
    async getRadioList () {
      const list = await getScreenRecord()
      this.list = list.data
    }
  }
}
</script>

<style lang="stylus" scoped>
  .record-wrapper
    font-size 14px
    width 100%
    height 100%
    .record-box
      display flex
      padding 20px
      flex-wrap wrap
      margin 0 auto
      justify-content space-between
      li
        width calc(50% - 10px)
        text-align center
        padding 20px 0
        box-shadow 0 0 3px #ccc
        margin-bottom 20px
        &>span
          display block
          margin-top 20px
          font-size: 12px

        .player-icon
          width 70px
          height 70px
          line-height 70px
          background #ffffff
          box-shadow 0 0 5px #999 inset
          border-radius 5px
          margin auto
          img
            width 40px
            margin-top 15px
    .player-wrapper
      height 100%
      width 100%
      position fixed
      background #ccc
</style>

<style lang="stylus">
  html, body
    font-size 14px
</style>
