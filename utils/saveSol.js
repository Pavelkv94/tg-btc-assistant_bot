const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../json_db/sol_data.json");

function saveSOL(data) {
  const dataToSave = JSON.stringify(data, null, 2);

  fs.writeFile(dataFilePath, dataToSave, (err) => {
    if (err) {
      console.error("Error writing to file", err);
    } else {
      console.log(`Data saved to ${dataFilePath}`);
    }
  });
}

function loadSOL() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const json = JSON.parse(data);
    return json || {};
  } catch (err) {
    console.error("Ошибка при загрузке SOL:", err);
    return [];
  }
}

module.exports = {
  saveSOL,
  loadSOL,
};
