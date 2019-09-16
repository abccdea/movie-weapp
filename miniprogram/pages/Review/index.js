// Import app
const app = getApp();

// Import services
const ReviewServices = require('../../services/review');
const UserServices = require('../../services/user.js');

Page({
  data: {},

  async getMovieReview(id) {
    try {
      const that = this;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      // Fetch the movie review
      const review = await ReviewServices.getReview(id);
      that.setData({ review });

      // Hide the loading status
      wx.hideLoading();
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to fetch the review',
      });
    }
  },

  onLoad(options) {
    const reviewId = options.id;
    this.setData({ reviewId });
    this.getMovieReview(reviewId);

    UserServices.getUserInfo().then(userInfo => {
      this.setData({ userInfo });
    }).catch(err => {
      console.log('Not Authenticated yet');
    });
  },

  showReviewOptions() {
    // pastReviewId
    const pastReviewId = this.data.review.pastReviewId;
    if (pastReviewId) {
      wx.navigateTo({ url: `/pages/Review/index?id=${pastReviewId}` });
    } else {
      const that = this;
      // Allow users to choose between text and audio review
      wx.showActionSheet({
        itemList: ['文字', '音频'],
        success(res) {
          app.globalData.movie = {
            id: that.data.review.movie.id,
            name: that.data.review.movie.name,
            poster: that.data.review.movie.poster,
          };

          app.globalData.review = {
            type: res.tapIndex === 0 ? 'text' : 'audio',
          }
          wx.navigateTo({ url: '/pages/EditReview/index' });
        },
      });
    }
  },

  async saveReview() {
    try {
      const reviewId = this.data.reviewId;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      // Fetch the movie review
      await ReviewServices.saveReview(reviewId);

      // Display success and hide the loading status
      wx.showToast({ icon: 'success', title: 'Saved' });
      wx.hideLoading();
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to save the review',
      });
    }
  },

  onTapLogin(event) {
    this.setData({ userInfo: event.detail.userInfo });
  },

  onPullDownRefresh() {

  },

})