import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUserStore } from '@/stores/user';
import authApi from '@/api/auth';
import userApi from '@/api/user';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

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

  it('should log in successfully', async () => {
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
    expect(localStorage.getItem('Etoken')).toEqual(res.data.token);
    expect(localStorage.getItem('userData')).toEqual(
      JSON.stringify(res.data.user)
    );
  });

  it('should log out successfully', () => {
    userStore.currentUser = {
      id: 1,
    };
    userStore.currentUserToken = 'abc123';

    userStore.logout();

    expect(userStore.currentUser).toEqual({});
    expect(userStore.currentUserToken).toEqual('');
  });

  it('should get user info successfully', async () => {
    const res = {
      data: {
        id: 1,
      },
    };
    userApi.getUserInfo = vi.fn(() => res);

    await userStore.getUserInfo({});

    expect(userApi.getUserInfo).toHaveBeenCalledOnce();
    expect(userStore.currentUser).toEqual(res.data);
  });

  it('should isTokenValid true successfully', async () => {
    const res = {
      data: {
        id: 1,
        roles: ['recruiter'],
      },
    };
    userApi.getUserInfo = vi.fn().mockResolvedValue(res);

    expect(await userStore.isTokenValid('token')).toStrictEqual({
      valid: true,
      roles: ['recruiter'],
    });
  });

  it('should isTokenValid false successfully', async () => {
    userApi.getUserInfo = vi.fn().mockRejectedValue({});

    expect(await userStore.isTokenValid('token')).toStrictEqual({
      valid: false,
      roles: undefined,
    });
  });

  it('should set current user successfully', async () => {
    const token = 'deezToken';
    const userData = { id: 1 };
    localStorage.setItem('Etoken', token);
    localStorage.setItem('userData', JSON.stringify(userData));

    await userStore.setCurrentUser();

    expect(localStorage.getItem('Etoken')).toEqual(token);
    expect(localStorage.getItem('userData')).toEqual(
      JSON.stringify(userData)
    );
  });

  it('should update user data successfully without updating profile picture', async () => {
    const res = {
      data: {
        id: 1,
      },
    };
    userApi.updateUserData = vi.fn(() => res);
    userApi.uploadProfilePicture = vi.fn();

    await userStore.updateUserData({ profilePicture: 'profilePicture' });

    expect(userApi.uploadProfilePicture).not.toHaveBeenCalledOnce();
    expect(userApi.updateUserData).toHaveBeenCalledOnce();
    expect(userStore.currentUser).toEqual(res.data);
  });

  it('should update user data successfully', async () => {
    const res = {
      data: {
        id: 1,
        profilePicture: 'profilePicture',
      },
    };
    userApi.updateUserData = vi.fn(() => res);
    userApi.uploadProfilePicture = vi.fn(() => ({
      data: 'profilePicture',
    }));

    await userStore.updateUserData({});

    expect(userApi.uploadProfilePicture).toHaveBeenCalledOnce();
    expect(userApi.updateUserData).toHaveBeenCalledOnce();
    expect(userStore.currentUser).toEqual(res.data);
  });

  it('should show that user portfolio is not empty', () => {
    userStore.currentUser = {
      portfolio: ['test'],
    };

    expect(userStore.isUserPortfolioEmpty).toBe(false);
  });
});
