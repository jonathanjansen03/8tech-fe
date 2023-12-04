import { beforeEach, describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import InputBox from '@/components/InputBox.vue';

describe('InputBox component', () => {
  let wrapper, vm;

  beforeEach(() => {
    wrapper = shallowMount(InputBox, {
      props: {
        id: 'Username',
      },
    });
    vm = wrapper.vm;
  });

  it('initialized well', () => {
    expect(vm).toBeTruthy();
  });

  it('should render error message when there is error', async () => {
    await wrapper.setProps({
      error: 'Error',
    });

    expect(wrapper.find('.error-message').exists()).toBe(true);
  });

  it('should emit update:modelValue when input event is triggered', async () => {
    await wrapper.find('input').trigger('input');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
  });

  it('should emit update:modelValue when blur event is triggered', async () => {
    await wrapper.find('input').trigger('blur');
    expect(wrapper.emitted()).toHaveProperty('blur');
  });
});
