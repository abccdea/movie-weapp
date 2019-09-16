// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/**
 * Fetch a list of saved reviews from the database.
 * @returns a list of movie reviews or empty array if no data found
 */
const getSaved = async userId => {
  // Initialization
  let reviews = [];

  try {
    // Retrieve all reviews about the movie
    savedReviewRes = await db.collection('saved-reviews')
      .where({ user_id: userId })
      .get();

    if (savedReviewRes && savedReviewRes.data) {
      // Fetch review data
      const reviewPromises = savedReviewRes.data.map(review => {
        return db.collection('reviews')
          .doc(review.review_id)
          .get();
      });
      const reviewRes = (await Promise.all(reviewPromises)).map(res => res.data);

      // Fetch movie data
      const moviePromises = reviewRes.map(review => {
        return db.collection('movies')
          .doc(review.movie_id)
          .get();
      });
      const movieData = {};
      (await Promise.all(moviePromises)).forEach(movie => {
        movieData[movie.data._id] = {
          poster: movie.data.image,
          name: movie.data.name,
        };
      });

      // Format the response
      reviews = reviewRes.map(review => ({
        id: review._id,
        userName: review.user_name,
        userAvatar: review.user_avatar,
        type: review.type,
        text: review.text,
        audioLength: review.audio_length,
        movie: movieData[review.movie_id],
      }));
    }
  } catch (err) {
    console.log(err);
  }

  return reviews;
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  // Fetch saved reviews by user id
  const reviews = await getSaved(userId);
  return { reviews };
}
