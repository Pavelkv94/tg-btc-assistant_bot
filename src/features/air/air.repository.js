import { loadInfo, saveInfo } from "../../utils/fileStorage.js";

export const airRepository = {
  /**
   * Get saved AQI data
   * @returns {object} AQI data with value and lastAlertLevel
   */
  getSavedAQI() {
    const data = loadInfo("AQI_value");
    return data || { value: 0, lastAlertLevel: "safe" };
  },

  /**
   * Save AQI data
   * @param {object} data - AQI data to save
   */
  saveAQIData(data) {
    saveInfo("AQI_value", { AQI_value: data });
  },
};

