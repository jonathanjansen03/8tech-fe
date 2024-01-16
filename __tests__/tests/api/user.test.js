import { beforeEach, describe, expect, it, vi } from 'vitest';

import userApi from '@/api/user';
import apiUtil from '@/utils/api';

describe('User API', () => {
  const token = 'token';

  beforeEach(() => {
    apiUtil.hitApi = vi.fn(() => Promise.resolve({}));
  });

  it('should get user info successfully', () => {
    userApi.getUserInfo({});
    expect(apiUtil.hitApi).toHaveBeenCalledOnce();
  });

  it('should update user data successfully', () => {
    userApi.updateUserData(token, {});
    expect(apiUtil.hitApi).toHaveBeenCalledOnce();
  });

  it('should upload profile picture successfully', () => {
    userApi.uploadProfilePicture(token, {});
    expect(apiUtil.hitApi).toHaveBeenCalledOnce();
  });
});
