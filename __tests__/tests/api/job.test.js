import { beforeEach, describe, expect, it, vi } from 'vitest';

import jobApi from '@/api/job';
import apiUtil from '@/utils/api';

describe('Job API', () => {
  beforeEach(() => {
    apiUtil.hitApi = vi.fn(() => Promise.resolve({}));
  });

  it('should create job successfully', () => {
    jobApi.create({});
    expect(apiUtil.hitApi).toHaveBeenCalledOnce();
  });

  it('should get job filter successfully', () => {
    jobApi.filter({});
    expect(apiUtil.hitApi).toHaveBeenCalledOnce();
  });
});
