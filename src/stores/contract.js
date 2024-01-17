import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useContractStore = defineStore('contract', () => {
  const contract = ref({});

  const setContract = (data) => {
    contract.value = Object.assign({}, data);
  };

  return {
    contract,
    setContract,
  };
});
