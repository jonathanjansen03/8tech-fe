import { defineAsyncComponent } from 'vue';

const AppButton = defineAsyncComponent(() =>
  import('@/components/AppButton.vue')
);
const AppCard = defineAsyncComponent(() => import('@/components/AppCard.vue'));
const AppFooter = defineAsyncComponent(() =>
  import('@/components/AppFooter.vue')
);
const AppNavbar = defineAsyncComponent(() =>
  import('@/components/AppNavbar.vue')
);
const AppTicker = defineAsyncComponent(() =>
  import('@/components/AppTicker.vue')
);
const DropdownList = defineAsyncComponent(() =>
  import('@/components/DropdownList.vue')
);
const ImageInput = defineAsyncComponent(() =>
  import('@/components/ImageInput.vue')
);
const InputBox = defineAsyncComponent(() =>
  import('@/components/InputBox.vue')
);
const JobCard = defineAsyncComponent(() => import('@/components/JobCard.vue'));
const PaginationComponent = defineAsyncComponent(() =>
  import('@/components/PaginationComponent.vue')
);
const SearchBar = defineAsyncComponent(() =>
  import('@/components/SearchBar.vue')
);

export {
  AppButton,
  AppCard,
  AppFooter,
  AppNavbar,
  AppTicker,
  DropdownList,
  ImageInput,
  InputBox,
  JobCard,
  PaginationComponent,
  SearchBar,
};
