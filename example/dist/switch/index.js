Component({
  externalClasses: ['v-class'],

  properties: {
    checked: {
      type: Boolean,
      value: false
    },

    loading: {
      type: Boolean,
      value: false
    },

    disabled: {
      type: Boolean,
      value: false
    }
  },

  data: {},

  methods: {
    handleSwitchChange() {
      if (this.data.loading || this.data.disabled) {
        return;
      }

      // 只是把新值传出，状态的改变有外部传入
      let checked = !this.data.checked;
      console.log(checked);

      this.triggerEvent('change', {
        checked,
        loading: this.data.loading
      });
    }
  }
});
