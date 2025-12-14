import { stationsService } from "./stations.service.js";

export const stationsController = {
  /**
   * Get all radio stations
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  async getStations(req, res) {
    try {
      const stations = await stationsService.getStations();
      res.status(200).json(stations);
    } catch (error) {
      console.error("❌ Error getting stations:", error);
      res.status(500).json({ error: "Failed to get stations" });
    }
  },

  /**
   * Add a new radio station
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  async addStation(req, res) {
    try {
      const stationId = await stationsService.createStation(req.body);
      res.status(201).json({ id: stationId });
    } catch (error) {
      console.error("❌ Error adding station:", error);
      res.status(500).json({ error: "Failed to add station" });
    }
  },
};

