// Import services
const MovieServices = require('../../services/movie');

Page({
  data: {},

  async getMovies() {
    try {
      const that = this;
      // Show a loading status
      wx.showLoading({ title: 'Loading...' });

      // Fetch a list of movies
      const movies = await MovieServices.getMovies();
      that.setData({ movies });

      // Hide the loading status
      wx.hideLoading();
    } catch (err) {
      console.log(err);
      wx.hideLoading();

      // Display error message
      wx.showToast({
        icon: 'none',
        title: 'Unable to fetch movies',
      });
    }
  },

  onLoad(options) {
    // Retrieve movies from the database
    this.getMovies();
  },

  async onPullDownRefresh() {
    await this.getMovies();
    wx.stopPullDownRefresh();
  },
})