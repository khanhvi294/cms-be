import importAccounts from "./create-account";
import importExamForms from "./create-examForms";

const seedsData = async () => {
  importAccounts();
  importExamForms();
};
export default seedsData;
