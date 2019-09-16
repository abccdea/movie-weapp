Component({
  properties: {},
  data: {},
  methods: {
    onTapLogin(event) {
      const loginDetail = {
        userInfo: event.detail.userInfo,
      };
      this.triggerEvent('onLogin', loginDetail);
    },
  }
})
