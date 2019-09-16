// Import libraries
const cloud = require('wx-server-sdk');

// Initialization
cloud.init({ env: 'test-6mdkg' });
const db = cloud.database();

/** Save a movie review. */
const saveReview = async (userId, reviewId) => {
  try {
    const data = {
      user_id: userId,
      review_id: reviewId,
    };

    // Check duplication
    const countRes = await db.collection('saved-reviews')
      .where(data).count();
    const duplicated = countRes.total > 0;

    if (!duplicated) {
      await db.collection('saved-reviews').add({ data });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.main = async (event, context) => {
  // Get review id from the payload
  const reviewId = event.id;

  // Retrieve the user id
  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  await saveReview(userId, reviewId);

  return {};
}
