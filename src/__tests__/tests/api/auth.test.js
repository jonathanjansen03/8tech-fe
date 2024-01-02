import { beforeEach, describe, expect, it, vi } from 'vitest';

import authApi from '@/api/auth';
import apiUtil from '@/utils/api';

describe('Auth API', () => {
  beforeEach(() => {
    apiUtil.hitApi = vi.fn(() => Promise.resolve({}));
  });

  it('should register successfully', () => {
    authApi.register({});
    expect(apiUtil.hitApi).toHaveBeenCalledOnce();
  });

  it('should login successfully', () => {
    authApi.login({});
    expect(apiUtil.hitApi).toHaveBeenCalledTimes(1);
  });
});
