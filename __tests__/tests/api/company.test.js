import { beforeEach, describe, expect, it, vi } from 'vitest';

import companyApi from '@/api/company';
import apiUtil from '@/utils/api';

describe('Company API', () => {
  beforeEach(() => {
    apiUtil.hitApi = vi.fn(() => Promise.resolve({}));
  });

  it('should create company successfully', () => {
    companyApi.create({});
    expect(apiUtil.hitApi).toHaveBeenCalledOnce();
  });
});
