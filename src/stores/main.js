import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMainStore = defineStore('main', () => {
  const isRecruiterPortal = ref(false);
  const showPortalNavbar = ref(false);

  function setRecruiterPortal(value) {
    isRecruiterPortal.value = value;
  }

  function togglePortalNavbar() {
    showPortalNavbar.value = !showPortalNavbar.value;
  }

  function closePortalNavbar() {
    showPortalNavbar.value = false;
  }

  return {
    isRecruiterPortal,
    showPortalNavbar,
    setRecruiterPortal,
    togglePortalNavbar,
    closePortalNavbar,
  };
});
