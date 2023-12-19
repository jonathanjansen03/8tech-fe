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
    const res = {
      data: {
        id: 1,
      },
    };
    authApi.register = vi.fn(() => Promise.resolve({ res }));

    await userStore.register({});

    expect(authApi.register).toHaveBeenCalledOnce();
  });

  it('should login successfully', async () => {
    const res = {
      data: {
        user: {
          id: 1,
        },
        token: 'abc123',
      },
    };
    authApi.login = vi.fn(() => res);

    await userStore.login({});

    expect(authApi.login).toHaveBeenCalledOnce();
    expect(userStore.currentUser).toEqual(res.data.user);
    expect(userStore.currentUserToken).toEqual(res.data.token);
  });
});
