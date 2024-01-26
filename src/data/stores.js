import pinia from '@/stores';
import { useCompanyStore } from '@/stores/company';
import { useContractStore } from '@/stores/contract';
import { useJobStore } from '@/stores/job';
import { useUserStore } from '@/stores/user';

const companyStore = useCompanyStore(pinia);
const contractStore = useContractStore(pinia);
const jobStore = useJobStore(pinia);
const userStore = useUserStore(pinia);

export { companyStore, contractStore, jobStore, userStore };
