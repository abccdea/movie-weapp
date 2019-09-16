// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/**
 * Fetch my past movie reviews from the database.
 * @param userId User id
 * @returns a list of movie reviews or empty array if no data found
 */
const getMyReviews = async userId => {
  // Initialization
  let reviews = [];

  try {
    // Retrieve all reviews about the movie
    reviewRes = await db.collection('reviews')
      .where({ user_id: userId })
      .get();

    // Format the response
    if (reviewRes && reviewRes.data) {
      const moviePromises = reviewRes.data.map(review => db.collection('movies')
        .doc(review.movie_id)
        .get());
      const movieMapping = {};
      const movieRes = (await Promise.all(moviePromises)).forEach(movie => {
        movieMapping[movie.data._id] = {
          name: movie.data.name,
          poster: movie.data.image,
        };
      });
      reviews = reviewRes.data.map(review => ({
        id: review._id,
        userName: review.user_name,
        userAvatar: review.user_avatar,
        type: review.type,
        text: review.text,
        audioLength: review.audio_length,
        movie: movieMapping[review.movie_id],
      }));
    }
  } catch (err) {
    console.log(err);
  }

  return reviews;
};

exports.main = async (event, context) => {
  // Retrieve the user id
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  // Fetch my movie reviews
  const reviews = await getMyReviews(userId);
  return { reviews };
}