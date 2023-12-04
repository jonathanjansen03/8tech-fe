import { describe, expect, it, vi } from 'vitest';

import authApi from '@/api/auth';
import apiUtil from '@/utils/api';

describe('Auth API', () => {
  it('should register successfully', () => {
    apiUtil.hitApi = vi.fn(() => Promise.resolve({}));

    authApi.register({});
    expect(apiUtil.hitApi).toHaveBeenCalledTimes(1);
  });
});
