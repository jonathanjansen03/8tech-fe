import { shallowMount } from '@vue/test-utils';
import AppNavbar from '@/components/AppNavbar.vue';

const push = vi.fn();
vi.mock('vue-router', () => ({
  RouterLink: vi.fn(),
  useRouter: vi.fn(() => ({
    push,
  })),
}));

describe('AppNavbar', () => {
  let wrapper;

  const stubs = {
    RouterLink: true,
  };

  beforeEach(() => {
    wrapper = shallowMount(AppNavbar, {
      sync: false,
      stubs,
      global: {
        stubs: ['router-link', 'router-view'],
      },
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('initialized well', () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it('should make isOpen true from false when toggleNavbar is called', () => {
    wrapper.vm.toggleNavbar();
    expect(wrapper.vm.isOpen).toBe(true);
  });

  it('should make isOpen false from true when toggleNavbar is called', () => {
    wrapper.vm.isOpen = true;
    wrapper.vm.toggleNavbar();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it('go to home when goToHome is called', () => {
    wrapper.vm.goToHome();
    expect(push).toHaveBeenCalledTimes(1);
  });
});
