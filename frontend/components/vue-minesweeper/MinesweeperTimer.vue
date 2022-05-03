<template>
  <div>{{ theTimeMMSS }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'

interface DataType {
  theTime: number
  timer: boolean | number
  timerReq: boolean | number
}

interface PropType {
  finished: boolean
}

interface MethodType {
  initTimer(): void
  setTimer(timestamp: number): void
}

interface ComputedType {
  theTimeMMSS(): string
}

export default Vue.extend({
  name: 'minesweeper-timer',
  props: {
    finished: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      theTime: 0,
      timer: false,
      timerReq: false,
    }
  },
  computed: {
    theTimeMMSS() {
      const current = this.theTime
      const minutes = Math.floor(current / 60.0)
      const seconds = Math.floor(current - minutes * 60)
      return `${minutes < 10 ? '0' + minutes : minutes}:${
        seconds < 10 ? '0' + seconds : seconds
      }`
    },
  },
  methods: {
    initTimer() {
      if (this.finished && typeof this.timerReq === 'number') {
        window.cancelAnimationFrame(this.timerReq)
        return
      }
      this.timer = false
      this.timerReq = window.requestAnimationFrame(this.setTimer)
    },
    setTimer(timestamp: number) {
      if (typeof this.timer === 'boolean' && !this.timer) {
        this.timer = timestamp
      }
      if (typeof this.timer === 'number') {
        this.theTime = (timestamp - this.timer) / 1000
        if (!this.finished) {
          window.requestAnimationFrame(this.setTimer)
        }
      }
    },
  },
} as ThisTypedComponentOptionsWithRecordProps<Vue, DataType, MethodType, ComputedType, PropType>)
</script>