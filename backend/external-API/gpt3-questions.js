const got = require("got");
const OPENAI_SECRET_KEY = "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";

const training = "**Produktinformationen** \ntitle: ";
const url = "https://api.openai.com/v1/engines/davinci/completions";
const params = {
  max_tokens: 100,
  temperature: 0.6,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: "**",
};
const headers = {
  Authorization: `Bearer ${OPENAI_SECRET_KEY}`,
};

exports.getAnswersToProductQuestions = (product_data, question) => {
  let title = product_data.title;
  let features = product_data.features;
  let infos = product_data.product_info;

  return new Promise(async (resolve) => {
    params.prompt = `${training}${title}\nfeatures:\n${features}\ninfos:\n${infos}\n\n**Frage**\n${question}\n\n**Antwort**\n`;
    console.log("prompt:\n" + params.prompt);
    try {
      let data = await got.post(url, { json: params, headers: headers }).json();
      resolve(data.choices[0].text);
    } catch (error) {
      console.log("gpt3 Questions Error: " + error);
      reject(error);
    }
  });
};
