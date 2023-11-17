import db from "../models";

const createExamFormsSeed = async (data) => {
  const dataFind = await db.ExamForm.findOne({
    where: { name: data.name },
  });

  if (dataFind) {
    console.log("ExamForm with name: " + dataFind.name + " is Existed");
    return null;
  }

  return await db.ExamForm.create(data, {});
};

const importExamForms = async () => {
  const examForms = [
    {
      name: "Tự luận",
    },
    {
      name: "Thực hành",
    },
    { name: "Trắc nghiệm" },
  ];

  const dataPromise = [];
  examForms.forEach((item) => {
    dataPromise.push(createExamFormsSeed(item));
  });

  await Promise.all(dataPromise);
};

export default importExamForms;
