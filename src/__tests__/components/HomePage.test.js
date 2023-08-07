import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(HelloWorld, {
      sync: false,
    });
  });

  it('initialized well', () => {
    expect(wrapper.vm).toBeTruthy();
  });
});
