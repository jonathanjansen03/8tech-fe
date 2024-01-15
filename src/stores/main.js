import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useMainStore = defineStore('main', () => {
  const recruiterPortal = ref(false);
  const portalNavbar = ref(false);

  const isRecruiterPortal = computed(() => recruiterPortal.value);
  const showPortalNavbar = computed(() => portalNavbar.value);

  function setRecruiterPortal(val) {
    recruiterPortal.value = val;
  }

  function togglePortalNavbar() {
    portalNavbar.value = !portalNavbar.value;
  }

  function closePortalNavbar() {
    portalNavbar.value = false;
  }

  return {
    isRecruiterPortal,
    setRecruiterPortal,
    togglePortalNavbar,
    showPortalNavbar,
    closePortalNavbar
  };
});
