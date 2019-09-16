// Import services
const UserServices = require('./user');

const getRecommended = async () => {
  const res = await wx.cloud.callFunction({
    name: 'getRecommended',
  });
  const movie = res.result;
  return movie;
};

const getMovies = async () => {
  const res = await wx.cloud.callFunction({
    name: 'getMovies',
  });
  const { movies } = res.result;
  return movies;
};

const getMovie = async id => {
  const res = await wx.cloud.callFunction({
    name: 'getMovie',
    data: { id },
  });
  const { movie } = res.result;
  return movie;
};

module.exports = {
  getRecommended,
  getMovies,
  getMovie,
};
