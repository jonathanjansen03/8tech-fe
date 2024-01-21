import { defineStore } from 'pinia';
import { ref } from 'vue';
import contractApi from '@/api/contract';

export const useContractStore = defineStore('contract', () => {
  const contract = ref({});

  const setContract = (data) => {
    contract.value = Object.assign({}, data);
  };

  const fetchStoreContract = async (id, token) => {
    const res = await contractApi.info(id, token);
    setContract(res.data);
  };

  const updateContract = async (data, token) => {
    setContract(await contractApi.update(data, token));
  };

  const rejectContract = async (id, token) => {
    await contractApi.reject(id, token);
  };

  return {
    contract,
    setContract,
    fetchStoreContract,
    updateContract,
    rejectContract,
  };
});
