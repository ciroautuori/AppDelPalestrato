import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: null,
    type: 'success',
    visible: false,
    timeoutId: null
  }),

  actions: {
    showToast(message, type = 'success', duration = 3000) {
      this.message = message;
      this.type = type;
      this.visible = true;
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.visible = false;
      }, duration);
    },

    hideToast() {
      this.visible = false;
      if (this.timeoutId) clearTimeout(this.timeoutId);
    }
  }
}); 