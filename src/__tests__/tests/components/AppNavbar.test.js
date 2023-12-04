import { beforeEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import AppNavbar from '@/components/AppNavbar.vue';

const push = vi.fn();
vi.mock('vue-router', () => ({
  RouterLink: vi.fn(),
  useRouter: vi.fn(() => ({
    push,
  })),
}));

describe('AppNavbar component', () => {
  let wrapper, vm;

  beforeEach(() => {
    wrapper = shallowMount(AppNavbar, {
      global: {
        stubs: ['router-link', 'router-view'],
      },
    });
    vm = wrapper.vm;
  });

  it('initialized well', () => {
    expect(vm).toBeTruthy();
  });

  it('should make isOpen true from false when toggleNavbar is called', () => {
    vm.toggleNavbar();
    expect(vm.isOpen).toBe(true);
  });

  it('should make isOpen false from true when toggleNavbar is called', () => {
    vm.isOpen = true;
    vm.toggleNavbar();
    expect(vm.isOpen).toBe(false);
  });

  it('go to home when goToHome is called', () => {
    vm.goToHome();
    expect(push).toHaveBeenCalledTimes(1);
  });
});
