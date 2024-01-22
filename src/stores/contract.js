import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import contractApi from '@/api/contract';
import config from '@/config';

export const useContractStore = defineStore('contract', () => {
  const contract = ref({});
  const contractCustomFields = ref({});
  const recruiterContractList = ref([]);
  const recruiterContractListPagination = ref({});

  const isContractCompleted = computed(
    () => contract.value.status === config.constants.contractStatus.completed
  );

  const isContractPaid = computed(
    () =>
      contract.value.payment?.paymentStatus ===
      config.constants.paymentStatus.paid
  );

  const setContractCustomFields = () => {
    const customFields = contract.value.customField || '';

    customFields.split(';').forEach((field) => {
      const [key, value] = field.split('=');
      contractCustomFields.value[key] = value;
    });
  };

  const setContract = (data) => {
    contract.value = Object.assign({}, data);
  };

  const fetchContract = async (id, token) => {
    const res = await contractApi.info(id, token);
    setContract(res.data);
    setContractCustomFields();
  };

  const updateContract = async (data, token) => {
    setContract(await contractApi.update(data, token));
  };

  const recruiterRejectContract = async (id, token) => {
    setContract(
      await contractApi.update(
        {
          id,
          status: config.constants.contractStatus.rejected,
        },
        token
      )
    );
  };

  const getRecruiterContractList = async (data, token) => {
    const res = await contractApi.recruiterContractList(data, token);
    recruiterContractList.value = res.data.data ? res.data.data.slice(0) : [];
    recruiterContractListPagination.value = {
      totalPages: res.data.totalPages,
      hasNext: res.data.hasNext,
      hasPrevious: res.data.hasPrevious,
      isLast: res.data.isLast,
      isFirst: res.data.isFirst,
    };
    return res.data;
  };

  const statusMapping = (statusCode) => {
    switch (statusCode) {
      case config.constants.contractStatus.accepted:
        return 'Menunggu konfirmasi Pekerja';
      case config.constants.contractStatus.completed:
        return 'Selesai';
      case config.constants.contractStatus.ongoing:
        return 'Masih dalah proses';
      default:
        return 'Unknown';
    }
  };

  const rejectContract = async (id, token) => {
    await contractApi.reject(id, token);
  };

  const getContractPayoutLink = async (id, token) => {
    await contractApi.getPayoutLink(id, token);
  };

  return {
    contract,
    contractCustomFields,
    recruiterContractList,
    recruiterContractListPagination,
    isContractCompleted,
    isContractPaid,
    setContract,
    setContractCustomFields,
    fetchContract,
    updateContract,
    recruiterRejectContract,
    getRecruiterContractList,
    statusMapping,
    rejectContract,
    getContractPayoutLink,
  };
});
