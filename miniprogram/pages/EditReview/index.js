// Import app
const app = getApp();

// Import services
const UserServices = require('../../services/user.js');

// Initialize a recorder manager
const recorderManager = wx.getRecorderManager();
recorderManager.onStart(() => {
  wx.showToast({
    icon: 'none',
    title: 'Recording ...',
  });
});

recorderManager.onStop((res) => {
  const { tempFilePath, duration } = res;
  app.globalData.review.audio = tempFilePath;
  app.globalData.review.audioLength = parseInt(duration / 1000, 10);
});

Page({
  data: {
    recording: false,
  },

  onLoad(options) {
    if (app.globalData.movie && app.globalData.review) {
      this.setData({
        movieName: app.globalData.movie.name,
        moviePoster: app.globalData.movie.poster,
        mode: app.globalData.review.type,
      });

      UserServices.getUserInfo().then(userInfo => {
        this.setData({ userInfo });
        app.globalData.review.userName = userInfo.nickName;
        app.globalData.review.userAvatar = userInfo.avatarUrl;
      }).catch(err => {
        console.log('Not Authenticated yet');
      });
    }
  },

  onInput(event) {
    this.setData({
      reviewText: event.detail.value.trim(),
    });
  },

  startRecording() {
    this.setData({ recording: true });
    recorderManager.start({ format: 'mp3' });
  },

  stopRecording() {
    this.setData({ recording: false });
    recorderManager.stop();
  },

  preview() {
    const mode = app.globalData.review.type;
    if (mode === 'text') {
      if (!this.data.reviewText) {
        wx.showToast({
          icon: 'none',
          title: 'Please comment',
        });
      } else {
        app.globalData.review.text = this.data.reviewText;
        wx.navigateTo({ url: '/pages/Preview/index' });
      }
    } else if (mode === 'audio') {
      if (!app.globalData.review.audio) {
        wx.showToast({
          icon: 'none',
          title: 'Please record',
        });
      } else {
        wx.navigateTo({ url: '/pages/Preview/index' });
      }
    }
  },

  onTapLogin(event) {
    this.setData({ userInfo: event.detail.userInfo });
    this.getSavedReviews();
  },
})