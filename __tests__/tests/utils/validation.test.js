import { describe, expect, it } from 'vitest';
import validationUtil from '@/utils/validation';

describe('Validation util', () => {
  it('should validate name', () => {
    expect(validationUtil.name('Test')).toBe(true);
  });

  it('should validate email', () => {
    expect(validationUtil.email('test@gmail.com')).toBe(true);
  });

  it('should validate password', () => {
    expect(validationUtil.password('Password123')).toBe(true);
  });

  it('should validate first name from form data', () => {
    expect(validationUtil.form('firstName', 'Test')).toBe(true);
  });

  it('should validate last name from form data', () => {
    expect(validationUtil.form('lastName', 'Test')).toBe(true);
  });

  it('should validate non-existent form field', () => {
    expect(validationUtil.form('test', 'Test')).toBe(true);
  });

  it('should validate email from form data', () => {
    expect(validationUtil.form('email', 'test@gmail.com')).toBe(true);
  });
});
