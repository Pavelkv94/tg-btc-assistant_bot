import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Save cryptocurrency price data to JSON file
 * @param {string} symbol - Crypto symbol (BTC or SOL)
 * @param {object} data - Price data to save
 */
export function saveInfo(symbol, data) {
  const dataFilePath = path.join(__dirname, `../../json_db/${symbol}_data.json`);
  const dataToSave = JSON.stringify(data[symbol], null, 2);

  fs.writeFile(dataFilePath, dataToSave, (err) => {
    if (err) {
      console.error(`❌ Error writing ${symbol} data to file:`, err);
    } else {
      console.log(`✅ ${symbol} data saved to ${dataFilePath}`);
    }
  });
}

/**
 * Load cryptocurrency price data from JSON file
 * @param {string} symbol - Crypto symbol (BTC or SOL)
 * @returns {object} Price data
 */
export function loadInfo(symbol) {
  try {
    const dataFilePath = path.join(__dirname, `../../json_db/${symbol}_data.json`);
    const data = fs.readFileSync(dataFilePath, "utf8");
    const json = JSON.parse(data);
    return json || {};
  } catch (err) {
    console.error(`❌ Error loading ${symbol} data:`, err);
    return {};
  }
}

