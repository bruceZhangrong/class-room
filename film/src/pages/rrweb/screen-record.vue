<template>
  <div class="record-wrapper">
    <ul class="record-box">
      <li v-for="(item, index) in list" :key="index">
        <span>{{ item.createTime }}</span>
        <div class="player-icon">
          <mt-button @click.native="playerRecord(item)" type="primary" size="small">Player</mt-button>
          <mt-button @click.native="deleteRecord(item.id)" type="danger" size="small">Delete</mt-button>
        </div>
      </li>
    </ul>
    <div class="player-wrapper" v-show="showPlayer">
      <div class="player-box"></div>
      <mt-button
        @click.native="showPlayer = false"
        type="default"
        size="small"
        class="close-player">
        X
      </mt-button>
    </div>
    <div class="go-back">
      <mt-button
        @click.native="$router.push('/rrweb')"
        type="primary"
        size="small">
        Go Back
      </mt-button>
    </div>
  </div>
</template>

<script>
import { getScreenRecord, deleteScreenRecord } from '../../api/index'
import RrwebPlayer from 'rrweb-player'
// import * as rrweb from 'rrweb'
import { Button } from 'mint-ui'
import 'rrweb-player/dist/style.css'

export default {
  components: {
    mtButton: Button
  },
  data () {
    return {
      list: [],
      showPlayer: false,
      playerConfig: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }
  },
  created () {
    this.getRadioList()
  },
  mounted () {
    // console.log(RrwebPlayer)
  },
  methods: {
    playerRecord (item) {
      const events = localStorage.getItem(item.createTime) || item.info
      // eslint-disable-next-line no-new
      new RrwebPlayer({
        target: document.querySelector('.player-box'),
        props: {
          events: JSON.parse(events),
          width: this.playerConfig.width * 0.8,
          height: this.playerConfig.height * 0.8
        }
      })

      // const replayer = new rrweb.Replayer(JSON.parse(events))
      // replayer.play()
      this.showPlayer = true
      console.log(JSON.parse(events))
    },
    async getRadioList () {
      const list = await getScreenRecord()
      this.list = list.data
    },

    async deleteRecord (id) {
      const isDeleted = await deleteScreenRecord({
        id: id
      })
      isDeleted && this.getRadioList()
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
      padding 20px
      li
        display flex
        padding 10px
        justify-content space-between
        text-align center
        box-shadow 0 0 3px #ccc
        margin-bottom 20px
        &>span
          display block
          line-height 30px

        .player-icon
          img
            width 28px
    .player-wrapper
      height 100%
      width 100%
      position fixed
      background #efefef
      top 0
      left 0
      z-index 1
      .close-player
        margin 8px
        float right
        border-radius 50%
        color #ccc
        height 24px
        width 24px
        padding 0
    .go-back
      text-align right
      padding 0 20px
</style>

<style lang="stylus">
  html, body
    font-size 14px
    .rr-player
      position absolute
      margin 0 auto
      float none
      top 5%
      left 0
      right 0
</style>
