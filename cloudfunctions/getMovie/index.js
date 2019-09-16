// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/**
 * Fetch movie details by id.
 * @param movieId Movie id
 * @param userId User id
 * @returns a movie object or null if not found
 */
const getMovieById = async (movieId, userId) => {
  // Initialization
  let movie = null;

  try {
    // Retrieve the movie from database by id
    const movieRes = await db.collection('movies').doc(movieId).get();
    if (!movieRes || !movieRes.data) throw new Error('No movie data found');

    // Fetch user's movie review
    const reviewRes = await db.collection('reviews')
      .where({
        user_id: userId,
        movie_id: movieId,
      })
      .get();

    // Format the response
    movie = {
      name: movieRes.data.name,
      description: movieRes.data.description,
      image: movieRes.data.image,
    };

    if (reviewRes && reviewRes.data && reviewRes.data.length > 0) {
      movie.reviewId = reviewRes.data[0]._id;
    }
  } catch (err) {
    console.log(err);
  }

  return movie;
};

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  // Get movie id from the payload
  const movieId = event.id;

  // Fetch movie details by id
  const movie = await getMovieById(movieId, userId);

  return { movie };
}