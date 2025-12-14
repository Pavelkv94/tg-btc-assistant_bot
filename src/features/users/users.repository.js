import { db } from "../../config/database.js";

export const usersRepository = {
  /**
   * Add a new user to the database
   * @param {object} user - User data
   * @returns {Promise<string>} Inserted user ID
   */
  async addUser(user) {
    const result = await db.getCollections().usersCollection.insertOne(user);
    return result.insertedId.toString();
  },

  /**
   * Find a user by chat_id
   * @param {string} chat_id - Telegram chat ID
   * @returns {Promise<object|null>} User data or null
   */
  async findUser(chat_id) {
    const result = await db.getCollections().usersCollection.findOne({ chat_id });
    return result || null;
  },

  /**
   * Get user's favorite stations
   * @param {string} user_id - User chat ID
   * @returns {Promise<string[]>} Array of station IDs
   */
  async getFavorites(user_id) {
    const user = await this.findUser(user_id);
    if (!user || !user.favorites) {
      return [];
    }
    return user.favorites.map((el) => el.radio_id);
  },

  /**
   * Add a station to user's favorites
   * @param {string} user_id - User chat ID
   * @param {string} station_id - Station ID to add
   * @returns {Promise<boolean>} Success status
   */
  async addFavorite(user_id, station_id) {
    const result = await db.getCollections().usersCollection.updateOne(
      { chat_id: user_id },
      { $addToSet: { favorites: { radio_id: station_id } } }
    );
    return result.modifiedCount !== 0;
  },

  /**
   * Remove a station from user's favorites
   * @param {string} user_id - User chat ID
   * @param {string} station_id - Station ID to remove
   * @returns {Promise<boolean>} Success status
   */
  async removeFavorite(user_id, station_id) {
    const result = await db.getCollections().usersCollection.updateOne(
      { chat_id: user_id },
      { $pull: { favorites: { radio_id: station_id } } }
    );
    return result.modifiedCount !== 0;
  },
};

