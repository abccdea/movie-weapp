// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/**
 * Return a integer in between 0 and maxNum.
 * @param maxNum Maximum number
 * @returns a random integer in between 0 and maxNum
 */
const getRandomSkipIdx = maxNum => {
  return Math.floor(Math.random() * maxNum);
};

/**
 * Return a movie in the database in random.
 * @returns a movie object or null.
 */
const getRandomMovie = async () => {
  // Get total number of movies in the database
  const countMovieRes = await db.collection('movies').count();
  const numOfMovies = countMovieRes.total;

  if (numOfMovies === 0) return null;
  else {
    // Generate a random skip number
    const skipNum = getRandomSkipIdx(numOfMovies);

    // Retrieve a random movie
    const movie = await db.collection('movies')
      .skip(skipNum)
      .limit(1)
      .get();

    const formatted = {
      ...movie.data[0],
      id: movie.data[0]._id,
      review: { official: true },
    };
    const { _id, ...res } = formatted;
    return res;
  }
};

/**
 * Return a movie randomly with a user review.
 * @param skipNum Number of reviews to be skipped
 * @returns a movie object with a user review
 */
const getRandomMovieWithReview = async skipNum => {
  // Retrieve a random movie
  let review = await db.collection('reviews')
    .skip(skipNum)
    .limit(1)
    .get();
  review = review.data[0]
  const { movie_id: movieId } = review;
  const movie = await db.collection('movies')
    .doc(movieId)
    .get();

  const formatted = {
    ...movie.data,
    id: movie.data._id,
    review: {
      id: review._id,
      userName: review.user_name,
      userAvatar: review.user_avatar,
      official: false,
    }
  };
  const { _id, ...res } = formatted;
  return res;
};

exports.main = async (event, context) => {
  // Initialization
  let movie = null;

  try {
    // Get total number of reviews in the database
    const countReviewRes = await db.collection('reviews').count();
    const numOfReviews = countReviewRes.total;

    if (numOfReviews === 0) {
      // No reviews were found in the database, return a random movie
      movie = await getRandomMovie();
    } else {
      // Generate a random skip number
      const skipNum = getRandomSkipIdx(numOfReviews);

      // Return a movie randomly with a user review
      movie = await getRandomMovieWithReview(skipNum);
    }
  } catch (err) {
    console.log(err);
  }

  return movie;
}