import { usersRepository } from "./users.repository.js";

export const usersService = {
  /**
   * Add a new user to the system
   * @param {object} userData - User data from Telegram
   * @returns {Promise<string>} User ID
   */
  async addUser(userData) {
    const newUser = {
      chat_id: userData.chatId.toString(),
      first_name: userData.first_name,
      username: userData.username || "",
      favorites: [],
    };
    
    const userId = await usersRepository.addUser(newUser);
    return userId;
  },

  /**
   * Find a user by chat ID
   * @param {string|number} chat_id - Telegram chat ID
   * @returns {Promise<object|null>} User data or null
   */
  async findUser(chat_id) {
    const chatIdString = chat_id.toString();
    const user = await usersRepository.findUser(chatIdString);
    return user;
  },

  /**
   * Add a favorite station for a user
   * @param {string} user_id - User chat ID
   * @param {string} station_id - Station ID
   * @returns {Promise<boolean>} Success status
   */
  async addFavoriteStation(user_id, station_id) {
    const isAdded = await usersRepository.addFavorite(user_id, station_id);
    return isAdded;
  },

  /**
   * Remove a favorite station for a user
   * @param {string} user_id - User chat ID
   * @param {string} station_id - Station ID
   * @returns {Promise<boolean>} Success status
   */
  async removeFavoriteStation(user_id, station_id) {
    const isRemoved = await usersRepository.removeFavorite(user_id, station_id);
    return isRemoved;
  },

  /**
   * Get user's favorite stations
   * @param {string} user_id - User chat ID
   * @returns {Promise<string[]>} Array of station IDs
   */
  async getFavoriteStations(user_id) {
    const favorites = await usersRepository.getFavorites(user_id);
    return favorites;
  },
};

