const EventEmitter = require('events')

class NaturalBreaksManager extends EventEmitter {
  constructor (settings) {
    super()
    this.settings = settings
    this.usingNaturalBreaks = settings.get('naturalBreaks')
    this.timer = null
    this.isOnNaturalBreak = false
    if (this.usingNaturalBreaks) {
      this.start()
    }
    this.on('resetIdleTime', () => {
      this.reset()
      console.log('reseting')
    })
  }

  start () {
    this.usingNaturalBreaks = true
    this._checkIdleTime()
  }

  stop () {
    this.usingNaturalBreaks = false
    this.isOnNaturalBreak = false
    clearTimeout(this.timer)
    this.timer = null
  }

  reset () {
    this.stop()
    this.start()
  }

  get idleTime () {
    if (this.usingNaturalBreaks) {
      return require('@paulcbetts/system-idle-time').getIdleTime()
    } else {
      return 0
    }
  }

  _checkIdleTime () {
    let lastIdleTime = 0
    this.timer = setInterval(() => {
      let idleTime = this.idleTime
      if (!this.isOnNaturalBreak && idleTime > 20000) {
        this.isOnNaturalBreak = true
        this.emit('naturalBreakStarted')
      }
      if (idleTime < 5000 && lastIdleTime > this.settings.get('breakDuration')) {
        this.emit('naturalBreakFinished')
      }
      lastIdleTime = idleTime
    }, 1000)
  }
}

module.exports = NaturalBreaksManager
