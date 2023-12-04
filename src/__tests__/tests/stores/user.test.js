import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUserStore } from '@/stores/user';
import authApi from '@/api/auth';

describe('User store', () => {
  let userStore;

  beforeEach(() => {
    setActivePinia(
      createPinia({
        createSpy: vi.fn(),
      })
    );
    userStore = useUserStore();
  });

  it('should register successfully', async () => {
    const data = {
      id: 1,
    };
    authApi.register = vi.fn(() => Promise.resolve({ data }));

    await userStore.register({});

    expect(userStore.currentUser).toEqual(data);
  });
});
