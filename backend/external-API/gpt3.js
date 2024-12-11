const got = require("got");
const OPENAI_SECRET_KEY = "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";

const training =
  "**Filteroptionen die eine Produktauswahl auf Produkte beschränkt, die den Bedürfnissen des Nutzers entsprechen.**\n*\n\nProdukt: „Smartphones“\n-\nOption: Handy-Auflösung\nMöglichkeiten: 1080 x 1920; 1080x2160; 1440 x 2560\n-\nOption: Betriebssystem\nMöglichkeiten: iOS; Android\n-\nOption: Handy Farbe\nMöglichkeiten: Schwarz; Weiß; Gold; Roségold\n-\nOption: Speicherplatz\nMöglichkeiten: Bis zu 64GB; 65 - 120GB; 121 - 250GB; 251 - 500GB; 500GB & mehr\n\n";
const url = "https://api.openai.com/v1/engines/davinci/completions";
const params = {
  max_tokens: 100,
  temperature: 0.7,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: "\nProdukt:",
};
const headers = {
  Authorization: `Bearer ${OPENAI_SECRET_KEY}`,
};

exports.getProductOptions = (keyword) => {
  return new Promise(async (resolve) => {
    params.prompt = `${training}Produkt: „${keyword}“`;
    console.log("prompt:\n" + params.prompt);
    try {
      let data = await got.post(url, { json: params, headers: headers }).json();
      resolve(data.choices[0].text);
    } catch (error) {
      console.log("gpt3 Error: " + error);
      reject(error);
    }
  });
};
