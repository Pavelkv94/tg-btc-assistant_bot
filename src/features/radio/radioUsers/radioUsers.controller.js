import { radioUsersService } from "./radioUsers.service.js";

export const radioUsersController = {
  /**
   * Get user's favorite stations
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  async getFavoriteStations(req, res) {
    try {
      const { user_id } = req.params;
      const favorites = await radioUsersService.getFavoriteStations(user_id);
      res.status(200).json(favorites);
    } catch (error) {
      console.error("❌ Error getting favorite stations:", error);
      res.status(500).json({ error: "Failed to get favorite stations" });
    }
  },

  /**
   * Add a station to user's favorites
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  async addFavoriteStation(req, res) {
    try {
      const { user_id } = req.params;
      const { station_id } = req.body;
      const isAdded = await radioUsersService.addFavoriteStation(user_id, station_id);
      res.status(200).json({ success: isAdded });
    } catch (error) {
      console.error("❌ Error adding favorite station:", error);
      res.status(500).json({ error: "Failed to add favorite station" });
    }
  },

  /**
   * Remove a station from user's favorites
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  async removeFavoriteStation(req, res) {
    try {
      const { user_id } = req.params;
      const { station_id } = req.body;
      const isRemoved = await radioUsersService.removeFavoriteStation(user_id, station_id);
      res.status(200).json({ success: isRemoved });
    } catch (error) {
      console.error("❌ Error removing favorite station:", error);
      res.status(500).json({ error: "Failed to remove favorite station" });
    }
  },
};

