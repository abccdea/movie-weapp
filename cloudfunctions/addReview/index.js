// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/**
 * Add a new movie review.
 * @param data Movie review data
 */
const addReview = async (data) => {
  try {
    await db.collection('reviews').add({ data });
  } catch (err) {
    console.log(err);
  }
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  // Unpack data from the payload
  const {
    movieId, text, type, userAvatar, userName,
    audioLength, audioUrl,
  } = event;

  // Set up a data structure
  const data = {
    movie_id: movieId,
    type,
    user_avatar: userAvatar,
    user_name: userName,
    user_id: userId,
  };

  if (type === 'text') {
    data.text = text;
  } else if (type === 'audio') {
    data.audio_length = audioLength;
    data.audio_url = audioUrl;
  }

  await addReview(data);

  return {};
}
