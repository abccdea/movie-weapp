const isAuthenticated = () => new Promise((resolve, reject) => {
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo'] === true) {
        resolve();
      } else {
        reject();
      }
    }
  });
});

const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    isAuthenticated().then(() => {
      wx.getUserInfo({
        success(res) {
          const userInfo = res.userInfo;
          resolve(userInfo);
        }
      });
    }).catch(() => {
      reject();
    })
  })
};

module.exports = {
  isAuthenticated,
  getUserInfo,
};
