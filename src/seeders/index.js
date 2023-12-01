import importAccounts from "./create-account";
import importExamForms from "./create-examForms";
// import importRoundResults from "./create-round-result";

const seedsData = async () => {
  importAccounts();
  importExamForms();
  // importRoundResults();
};
export default seedsData;
