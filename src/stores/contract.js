import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import contractApi from '@/api/contract';
import ratingApi from '@/api/rating';
import config from '@/config';

export const useContractStore = defineStore('contract', () => {
  const contract = ref({});
  const contractCustomFields = ref({});
  const recruiterContractList = ref([]);
  const recruiterContractListPagination = ref({});
  const payout = ref({});

  const isContractPending = computed(
    () => contract.value.status === config.constants.contractStatus.pending
  );

  const isContractCompleted = computed(
    () => contract.value.status === config.constants.contractStatus.completed
  );

  const isContractPaid = computed(
    () =>
      contract.value.payment?.paymentStatus ===
      config.constants.paymentStatus.paid
  );

  const isContractRated = computed(() => !!contract.value.ratingId);

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

  const recruiterPayContract = async (id, token) => {
    const res = await contractApi.paymentRequest(id, token);
    return res.data?.paymentUrl;
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
    const res = await contractApi.getPayoutLink(id, token);
    payout.value = res.data;
  };

  const rateFreelancer = async (data, token) => {
    const res = await ratingApi.create(data, token);

    setContract({
      ...contract.value,
      ratingId: res.data.id,
    });
  };

  return {
    contract,
    contractCustomFields,
    recruiterContractList,
    recruiterContractListPagination,
    payout,
    isContractPending,
    isContractCompleted,
    isContractPaid,
    isContractRated,
    recruiterPayContract,
    setContract,
    setContractCustomFields,
    fetchContract,
    updateContract,
    recruiterRejectContract,
    getRecruiterContractList,
    statusMapping,
    rejectContract,
    getContractPayoutLink,
    rateFreelancer,
  };
});
