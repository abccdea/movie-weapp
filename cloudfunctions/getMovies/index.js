// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/**
 * Fetch a list of movies from the database.
 * @returns a list of movie instances or empty array if no data found
 */
const getMovies = async () => {
  // Initialization
  let movies = [];

  try {
    // Retrieve all movies from the database
    movieRes = await db.collection('movies').get();

    // Format the response
    if (movieRes && movieRes.data) {
      movies = movieRes.data.map(movie => ({
        id: movie._id,
        name: movie.name,
        category: movie.category,
        image: movie.image,
      }));
    }
  } catch (err) {
    console.log(err);
  }

  return movies;
};

exports.main = async (event, context) => {
  const movies = await getMovies();
  return { movies };
}