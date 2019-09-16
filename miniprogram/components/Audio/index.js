// Initialize a inner audio context
const innerAudioContext = wx.createInnerAudioContext();

Component({
  properties: {
    audioUrl: String,
    audioLength: Number,
  },
  data: {
    playing: false,
  },
  methods: {
    playAudio() {
      if (this.properties.audioUrl) {
        innerAudioContext.src = this.properties.audioUrl;

        innerAudioContext.onPlay(() => {
          this.setData({ playing: true });
        });

        innerAudioContext.onEnded(() => {
          this.setData({ playing: false });
        });

        innerAudioContext.onStop(() => {
          this.setData({ playing: false });
        });

        innerAudioContext.play();
      }
    },
    stopAudio() {
      innerAudioContext.stop();
    }
  }
})
