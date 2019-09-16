// Import services
const MovieServices = require('../../services/movie');

Page({
  data: {
    movie: {},
  },

  async getRecommendedMovie() {
    try {
      const that = this;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      // Fetch a movie in random
      const movie = await MovieServices.getRecommended();
      that.setData({ movie });

      // Hide the loading status
      wx.hideLoading();
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to load movie data',
      });
    }
  },

  onLoad(options) {
    this.getRecommendedMovie();
  },

  async onPullDownRefresh() {
    await this.getRecommendedMovie();
    wx.stopPullDownRefresh();
  },
})