// Import app
const app = getApp();

// Import services
const UserServices = require('../../services/user.js');
const ReviewServices = require('../../services/review.js');

Page({
  data: {},

  async addReview() {
    try {
      const that = this;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      await ReviewServices.addReview({
        movieId: this.data.movieId,
        type: this.data.mode,
        userAvatar: this.data.userAvatar,
        userName: this.data.userName,
        audio: this.data.audio,
        audioLength: this.data.audioLength,
        text: this.data.text,
      });

      // Hide the loading status
      wx.hideLoading();

      wx.showToast({
        icon: 'none',
        title: 'Success',
      });

      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/Reviews/index?id=${this.data.movieId}`,
        });
      }, 1000);
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to publish the review',
      });
    }
  },

  onLoad(options) {
    if (app.globalData.movie && app.globalData.review) {
      this.setData({
        movieId: app.globalData.movie.id,
        movieName: app.globalData.movie.name,
        moviePoster: app.globalData.movie.poster,
        userName: app.globalData.review.userName,
        userAvatar: app.globalData.review.userAvatar,
        mode: app.globalData.review.type,
        text: app.globalData.review.text,
        audio: app.globalData.review.audio,
        audioLength: app.globalData.review.audioLength,
      });

      UserServices.getUserInfo().then(userInfo => {
        this.setData({ userInfo });
      }).catch(err => {
        console.log('Not Authenticated yet');
      });
    }
  },

  onTapLogin(event) {
    this.setData({ userInfo: event.detail.userInfo });
  },

  edit() {
    wx.navigateBack({ delta: 1 });
  },
})