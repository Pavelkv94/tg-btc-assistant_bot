import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Save data to JSON file
 * @param {string} symbol - Data identifier (BTC, SOL, AQI_value, etc.)
 * @param {object} data - Data to save
 */
export function saveInfo(symbol, data) {
  const dataFilePath = path.join(__dirname, `../../json_db/${symbol}_data.json`);

  // Handle both crypto format (data[symbol]) and simple format (data directly)
  const dataToSave = data[symbol]
    ? JSON.stringify(data[symbol], null, 2)
    : JSON.stringify(data, null, 2);

  fs.writeFile(dataFilePath, dataToSave, (err) => {
    if (err) {
      console.error(`❌ Error writing ${symbol} data to file:`, err);
    } else {
      console.log(`✅ ${symbol} data saved to ${dataFilePath}`);
    }
  });
}

/**
 * Load data from JSON file
 * @param {string} symbol - Data identifier (BTC, SOL, AQI_value, etc.)
 * @returns {object} Data from file
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

