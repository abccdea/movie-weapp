// Import app
const app = getApp();

// Import services
const MovieServices = require('../../services/movie');

Page({
  data: {
    showMore: false,
  },

  async getMovie(id) {
    try {
      const that = this;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      // Fetch a list of movies
      const movie = await MovieServices.getMovie(id);
      that.setData({ movie, movieId: id });

      // Hide the loading status
      wx.hideLoading();
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to fetch the movie',
      });
    }
  },

  switchTextDisplay() {
    // Collapse or show more text data
    this.setData({ showMore: !this.data.showMore });
  },

  showReviewOptions() {
    const reviewId = this.data.movie.reviewId;
    if (reviewId) {
      wx.navigateTo({ url: `/pages/Review/index?id=${reviewId}` });
    } else {
      const that = this;
      // Allow users to choose between text and audio review
      wx.showActionSheet({
        itemList: ['文字', '音频'],
        success(res) {
          app.globalData.movie = {
            id: that.data.movieId,
            name: that.data.movie.name,
            poster: that.data.movie.image,
          };

          app.globalData.review = {
            type: res.tapIndex === 0 ? 'text' : 'audio',
          };

          wx.navigateTo({ url: '/pages/EditReview/index' });
        },
      });
    }
  },

  onLoad(options) {
    this.getMovie(options.id);
  },

  async onPullDownRefresh() {
    await this.getMovie(this.data.movieId);
    wx.stopPullDownRefresh();
  },
})