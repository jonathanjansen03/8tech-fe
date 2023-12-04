import { describe, expect, it, vi } from 'vitest';
import apiUtil from '@/utils/api';

describe('API util', () => {
  const url = '/test';
  const params = {
    id: 1,
  };
  const body = {
    name: 'test',
  };
  const successResponse = {
    statusCode: 200,
  };

  it('should hit GET API successfully', async () => {
    const res = {
      json: vi.fn(() => Promise.resolve(successResponse)),
    };
    global.fetch = vi.fn(() => Promise.resolve(res));

    const result = await apiUtil.hitApi({
      method: 'GET',
      url,
    });

    expect(result).toEqual(successResponse);
  });

  it('should hit POST API successfully', async () => {
    const res = {
      json: vi.fn(() => Promise.resolve(successResponse)),
    };
    global.fetch = vi.fn(() => Promise.resolve(res));

    const result = await apiUtil.hitApi({
      method: 'POST',
      url,
      params,
      body,
    });

    expect(result).toEqual(successResponse);
  });

  // it('should hit PUT API successfully', async () => {
  //   const res = {
  //     json: vi.fn(() => Promise.resolve(successResponse)),
  //   };
  //   global.fetch = vi.fn(() => Promise.resolve(res));

  //   const result = await apiUtil.hitApi({
  //     method: 'PUT',
  //     url,
  //     params,
  //     body,
  //   });

  //   expect(result).toEqual(successResponse);
  // });

  // it('should hit DELETE API successfully', async () => {
  //   const res = {
  //     json: vi.fn(() => Promise.resolve(successResponse)),
  //   };
  //   global.fetch = vi.fn(() => Promise.resolve(res));

  //   const result = await apiUtil.hitApi({
  //     method: 'DELETE',
  //     url,
  //   });

  //   expect(result).toEqual(successResponse);
  // });

  it('should throw error when method is invalid', async () => {
    const expectedError = new Error('Method must be GET, POST, PUT or DELETE');

    try {
      await apiUtil.hitApi({
        method: 'INVALID',
        url,
      });
    } catch (err) {
      expect(err).toEqual(expectedError);
    }
  });

  it('should throw error when fetch fails', async () => {
    const error = { statusCode: 500 };
    const res = {
      json: vi.fn(() => Promise.resolve(error)),
    };
    global.fetch = vi.fn(() => Promise.resolve(res));

    try {
      await apiUtil.hitApi({
        method: 'GET',
        url,
      });
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});
