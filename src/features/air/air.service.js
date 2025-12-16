import { airRepository } from "./air.repository.js";
import { bot } from "../../config/bot.js";

export const airService = {
  /**
   * Determine alert level based on AQI value
   */
  getAlertLevel(aqiValue) {
    if (aqiValue > 200) return "lethal";
    if (aqiValue > 150) return "dangerous";
    if (aqiValue > 100) return "careful";
    return "safe";
  },

  /**
   * Monitor AQI and send alerts if thresholds crossed
   */
  async monitorAQI(aqiValue, userChatIds, type) {
    try {
      const savedData = airRepository.getSavedAQI();
      const savedValue = savedData.value || 0;
      const lastAlertLevel = savedData.lastAlertLevel || "safe";

      const currentLevel = this.getAlertLevel(aqiValue);
      const previousLevel = this.getAlertLevel(savedValue);

      // Determine if we should send an alert
      const levelChanged = currentLevel !== lastAlertLevel;

      if (levelChanged) {
        const message = this.getAqiAlertMessage(aqiValue)[currentLevel];

        // Send alerts to all users
        for (const chatId of userChatIds) {
          try {
            await bot.sendMessage(chatId, message);
          } catch (error) {
            console.error(`❌ Error sending AQI alert to user ${chatId}:`, error.message);
          }
        }

        // Save updated AQI data
        airRepository.saveAQIData({
          value: aqiValue,
          lastAlertLevel: currentLevel,
          lastUpdated: new Date().toISOString()
        });

        console.log(`🌤 AQI alert sent: ${aqiValue} (${currentLevel})`);
      } else {
        // Update value but don't send alert
        airRepository.saveAQIData({
          value: aqiValue,
          lastAlertLevel: currentLevel,
          lastUpdated: new Date().toISOString()
        });
        if (type === "manual") {
          for (const chatId of userChatIds) {
            try {
              await bot.sendMessage(chatId, this.getAqiAlertMessage(aqiValue)[currentLevel]);
            } catch (error) {
              console.error(`❌ Error sending AQI update to user ${chatId}:`, error.message);
            }
          }
        }
        console.log(`🌤 AQI updated: ${aqiValue} (no alert - same level: ${currentLevel})`);
      }
    } catch (error) {
      console.error("❌ Error monitoring AQI:", error);
    }
  },

  /**
   * Helper to compare alert levels
   */
  getLevelPriority(level) {
    const priorities = { safe: 0, careful: 1, dangerous: 2, lethal: 3 };
    return priorities[level] || 0;
  },

   getAqiAlertMessage (aqiValue) {
    return {
      lethal: `☠️ СМЕРТЕЛЬНОЕ КАЧЕСТВО ВОЗДУХА!\n\nТекущий AQI: ${aqiValue}\nОСТАВАЙТЕСЬ ДОМА! Не выходите на улицу!`,
      dangerous: `🚨 ОПАСНОЕ КАЧЕСТВО ВОЗДУХА!\n\nТекущий AQI: ${aqiValue}\nИзбегайте прогулок на улице. Носите маску, если необходимо выйти.`,
      careful: `⚠️ Плохое качество воздуха\n\nТекущий AQI: ${aqiValue}\nБудьте осторожны на улице. Рекомендуется сократить время на открытом воздухе.`,
      safe: `✅ Качество воздуха хорошее\n\nТекущий AQI: ${aqiValue}\nКачество воздуха приемлемое.`
    };
  }
};

