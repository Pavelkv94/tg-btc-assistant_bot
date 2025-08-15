const fs = require("fs");
const path = require("path");


function saveInfo(symbol, data) {
    const dataFilePath = path.join(__dirname, `../json_db/${symbol}_data.json`);
    const dataToSave = JSON.stringify(data[symbol], null, 2);

    fs.writeFile(dataFilePath, dataToSave, (err) => {
        if (err) {
            console.error("Error writing to file", err);
        } else {
            console.log(`Data saved to ${dataFilePath}`);
        }
    });
}

function loadInfo(symbol) {
    try {
        const dataFilePath = path.join(__dirname, `../json_db/${symbol}_data.json`);
        const data = fs.readFileSync(dataFilePath, "utf8");
        const json = JSON.parse(data);
        return json || {};
    } catch (err) {
        console.error("Ошибка при загрузке SOL:", err);
        return [];
    }
}


module.exports = {
    saveInfo,
    loadInfo,
};
