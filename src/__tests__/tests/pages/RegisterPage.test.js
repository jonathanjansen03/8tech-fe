import { beforeEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useRouter } from 'vue-router';

import { useUserStore } from '@/stores/user';
import RegisterPage from '@/pages/RegisterPage.vue';
import config from '@/config';

describe('Register page', () => {
  let wrapper, vm, pinia, router, userStore;

  vi.mock('vue-router', () => ({
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
  }));

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn(),
    });
    router = useRouter();
    userStore = useUserStore();

    userStore.register = vi.fn().mockResolvedValue({});

    wrapper = shallowMount(RegisterPage, {
      global: {
        plugins: [pinia],
      },
    });
    vm = wrapper.vm;
  });

  it('initialized well', () => {
    expect(vm).toBeTruthy();
  });

  it('should pass a valid email', () => {
    vm.formData.email = 'test@test.com';
    vm.validateEmail();
    expect(vm.errors.email).toBe('');
  });

  it('should not pass an invalid email', () => {
    vm.formData.email = 'test';
    vm.validateEmail();
    expect(vm.errors.email).toBe('Masukkan email yang valid.');
  });

  it('should return immediately when validating empty email', () => {
    vm.validateEmail();
    expect(vm.errors.email).toBe('');
  });

  it('should pass matching password and confirm password', () => {
    vm.formData.password = 'password123';
    vm.formData.confirmPassword = 'password123';
    vm.validateConfirmPassword();
    expect(vm.errors.confirmPassword).toBe('');
  });

  it('should not pass different password and confirm password', () => {
    vm.formData.password = 'password123';
    vm.formData.confirmPassword = 'qwer1234';

    vm.validateConfirmPassword();

    expect(vm.errors.confirmPassword).toBe('Harus sama dengan password.');
  });

  it('should return immediately when validating empty confirm password', () => {
    vm.validateConfirmPassword();
    expect(vm.errors.confirmPassword).toBe('');
  });

  it('should register successfully', async () => {
    await vm.doRegister();
    expect(userStore.register).toHaveBeenCalledTimes(1);
  });

  it('should register with failure', async () => {
    userStore.register = vi.fn().mockRejectedValue({});
    wrapper = shallowMount(RegisterPage, {
      global: {
        plugins: [pinia],
      },
    });
    await wrapper.vm.doRegister();
    expect(wrapper.vm.register).toHaveBeenCalledTimes(1);
  });

  it('should redirect to login page when handling successful register', async () => {
    vm.handleSuccessfulRegister();
    expect(vm.router.push).toHaveBeenCalledWith(config.pages.home);
  });

  it('should show alert when handling failed register with error 500', () => {
    global.alert = vi.fn();

    vm.handleFailedRegister({ statusCode: 500 });

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith(
      'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
    );
  });

  it('should map errors when handling failed register', () => {
    vm.handleFailedRegister({
      message: {
        password: 'INVALID_PASSWORD',
      },
    });

    expect(vm.errors.password).toBe('INVALID_PASSWORD');
  });
});
