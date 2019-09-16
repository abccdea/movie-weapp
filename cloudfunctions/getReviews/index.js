// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/**
 * Fetch a list of movie reviews from the database.
 * @returns a list of movie reviews or empty array if no data found
 */
const getReviews = async movieId => {
  // Initialization
  let reviews = [];

  try {
    // Retrieve all reviews about the movie
    reviewRes = await db.collection('reviews')
      .where({ movie_id: movieId })
      .get();

    // Format the response
    if (reviewRes && reviewRes.data) {
      reviews = reviewRes.data.map(review => ({
        id: review._id,
        userName: review.user_name,
        userAvatar: review.user_avatar,
        type: review.type,
        text: review.text,
        audioLength: review.audio_length,
      }));
    }
  } catch (err) {
    console.log(err);
  }

  return reviews;
};

exports.main = async (event, context) => {
  // Get movie id from the payload
  const id = event.id;

  // Fetch reviews by a movie id
  const reviews = await getReviews(id);
  return { reviews };
}