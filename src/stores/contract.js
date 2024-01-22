import { defineStore } from 'pinia';
import { ref } from 'vue';
import contractApi from '@/api/contract';
import config from '@/config/index.js';

export const useContractStore = defineStore('contract', () => {
  const contract = ref({});
  const recruiterContractList = ref([]);
  const recruiterContractListPagination = ref({});

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

  const recruiterRejectContract = async (id, token) => {
    setContract(await contractApi.update({
      id,
      status: config.constants.contractStatus.REJECTED
    }, token));
  };

  const getRecruiterContractList = async (data, token) => {
    const res = await contractApi.recruiterContractList(data, token);
    recruiterContractList.value = res.data.data ? res.data.data.slice(0) : [];
    recruiterContractListPagination.value = {
      totalPages: res.data.totalPages,
      hasNext: res.data.hasNext,
      hasPrevious: res.data.hasPrevious,
      isLast: res.data.isLast,
      isFirst: res.data.isFirst
    };
    console.log('#ricat get rec list ', recruiterContractList.value);
    return res.data;
  };

  const statusMapping = (statusCode) => {
    switch (statusCode) {
      case config.constants.contractStatus.ACCEPTED:
        return 'Menunggu konfirmasi Pekerja';
      case config.constants.contractStatus.COMPLETED:
        return 'Selesai';
      case config.constants.contractStatus.ONGOING:
        return 'Masih dalah proses';
      default:
        return 'Unknown';
    }
  };

  return {
    contract,
    recruiterContractListPagination,
    recruiterContractList,
    recruiterRejectContract,
    statusMapping,
    setContract,
    fetchStoreContract,
    updateContract,
    getRecruiterContractList
  };
});
