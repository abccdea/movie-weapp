const UserServices = require('./user.js');

const getReviews = async id => {
  const res = await wx.cloud.callFunction({
    name: 'getReviews',
    data: { id }
  });
  const { reviews } = res.result;
  return reviews;
};

const getSavedReviews = async () => {
  await UserServices.isAuthenticated();
  const res = await wx.cloud.callFunction({
    name: 'getSaved',
  });
  const { reviews } = res.result;
  return reviews;
};

const getMyReviews = async () => {
  await UserServices.isAuthenticated();
  const res = await wx.cloud.callFunction({
    name: 'getMyReviews',
  });
  const { reviews } = res.result;
  return reviews;
};

const getReview = async id => {
  const res = await wx.cloud.callFunction({
    name: 'getReview',
    data: { id },
  });
  const { review } = res.result;
  return review;
};

const saveReview = async id => {
  await UserServices.isAuthenticated();
  await wx.cloud.callFunction({
    name: 'saveReview',
    data: { id },
  });
};

const getId = () => {
  return Math.floor((1 + Math.random()) * 0x100000000).toString(16).slice(1);
};

const addReview = async values => {
  await UserServices.isAuthenticated();

  const data = {
    movieId: values.movieId,
    type: values.type,
    userAvatar: values.userAvatar,
    userName: values.userName,
  }

  if (values.type === 'audio') {
    const res = await wx.cloud.uploadFile({
      cloudPath: `audios/${getId()}.mp3`,
      filePath: values.audio,
    });
    data.audioUrl = res.fileID;
    data.audioLength = values.audioLength;
  } else if (values.type === 'text') {
    data.text = values.text;
  }

  // Save the review in the database
  await wx.cloud.callFunction({
    name: 'addReview',
    data,
  });
};

module.exports = {
  getReviews,
  getSavedReviews,
  getMyReviews,
  getReview,
  saveReview,
  addReview,
};
