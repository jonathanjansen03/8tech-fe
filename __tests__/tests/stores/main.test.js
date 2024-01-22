import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMainStore } from '@/stores/main';

describe('Main store', () => {
  let mainStore;

  beforeEach(() => {
    setActivePinia(
      createPinia({
        createSpy: vi.fn(),
      })
    );
    mainStore = useMainStore();
  });

  it('should togglePortalNavbar & close it successfully', () => {
    mainStore.togglePortalNavbar();
    expect(mainStore.showPortalNavbar).toEqual(true);

    mainStore.closePortalNavbar();
    expect(mainStore.showPortalNavbar).toEqual(false);
  });
});
