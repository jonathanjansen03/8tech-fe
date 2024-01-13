import { beforeEach, describe, expect, it, vi } from 'vitest';

import userApi from '@/api/user';
import apiUtil from '@/utils/api';

describe('User API', () => {
  beforeEach(() => {
    apiUtil.hitApi = vi.fn(() => Promise.resolve({}));
  });

  it('should get user info successfully', () => {
    userApi.getUserInfo({});
    expect(apiUtil.hitApi).toHaveBeenCalledOnce();
  });
});
