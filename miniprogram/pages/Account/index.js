// Import services
const ReviewServices = require('../../services/review.js');
const UserServices = require('../../services/user.js');

Page({
  data: {
    showSavedReviews: true,
  },

  async getSavedReviews() {
    try {
      const that = this;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      // Fetch reviews of a movie
      const reviews = await ReviewServices.getSavedReviews();
      that.setData({ reviews });

      // Hide the loading status
      wx.hideLoading();
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to load saved reviews',
      });
    }
  },

  async getMyReviews() {
    try {
      const that = this;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      // Fetch reviews of a movie
      const reviews = await ReviewServices.getMyReviews();
      that.setData({ reviews });

      // Hide the loading status
      wx.hideLoading();
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to load my reviews',
      });
    }
  },

  switchReview(e) {
    const showSavedReviews = e.detail.value;
    this.setData({ showSavedReviews });
    if (showSavedReviews) {
      this.getSavedReviews();
    } else {
      this.getMyReviews();
    }
  },

  onLoad(options) {
    UserServices.getUserInfo().then(userInfo => {
      this.setData({ userInfo });
      this.getSavedReviews();
    }).catch(err => {
      console.log('Not Authenticated yet');
    });
  },

  onTapLogin(event) {
    this.setData({ userInfo: event.detail.userInfo });
    this.getSavedReviews();
  },

  async onPullDownRefresh() {
    const { showSavedReviews } = this.data;
    if (showSavedReviews) {
      await this.getSavedReviews();
    } else {
      await this.getMyReviews();
    }
    wx.stopPullDownRefresh();
  },
})