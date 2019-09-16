// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/**
 * Fetch review details by id.
 * @param reviewId Review id
 * @param userId User id
 * @returns a review object or null if not found
 */
const getReviewById = async (reviewId, userId) => {
  // Initialization
  let review = null;

  try {
    // Retrieve the review from database by id
    const reviewRes = await db.collection('reviews').doc(reviewId).get();
    if (!reviewRes || !reviewRes.data) throw new Error('No review data found');

    // Fetch movie information
    const movieId = reviewRes.data.movie_id;
    const movieRes = await db.collection('movies').doc(movieId).get();
    if (!movieRes || !movieRes.data) throw new Error('No movie data found');
    const { name: movieName, image: poster } = movieRes.data;

    // Fetch user's review
    const userReviewRes = await db.collection('reviews')
      .where({
        user_id: userId,
        movie_id: movieId,
      })
      .get();

    // Format the response
    review = {
      userName: reviewRes.data.user_name,
      userAvatar: reviewRes.data.user_avatar,
      type: reviewRes.data.type,
      text: reviewRes.data.text,
      audioUrl: reviewRes.data.audio_url,
      audioLength: reviewRes.data.audio_length,
      movie: {
        id: movieId,
        name: movieName,
        poster,
      },
    };

    if (userReviewRes && userReviewRes.data && userReviewRes.data.length > 0) {
      review.pastReviewId = userReviewRes.data[0]._id;
    }
  } catch (err) {
    console.log(err);
  }

  return review;
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  // Get review id from the payload
  const reviewId = event.id;

  // Fetch review details by id
  const review = await getReviewById(reviewId, userId);

  return { review };
}