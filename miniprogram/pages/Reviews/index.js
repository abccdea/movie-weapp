// Import services
const ReviewServices = require('../../services/review.js');

Page({
  data: {},

  async getMovieReviews(movieId) {
    try {
      const that = this;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      // Fetch reviews of a movie
      const reviews = await ReviewServices.getReviews(movieId);
      that.setData({ reviews, movieId });

      // Hide the loading status
      wx.hideLoading();
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to load movie reviews',
      });
    }
  },

  onLoad(options) {
    // Retrieve reviews of a movie
    this.getMovieReviews(options.id);
  },

  
  async onPullDownRefresh() {
    await this.getMovieReviews(this.data.movieId);
    wx.stopPullDownRefresh();
  },
})