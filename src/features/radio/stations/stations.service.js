import { stationsRepository } from "./stations.repository.js";

export const stationsService = {
  /**
   * Get all radio stations
   * @returns {Promise<Array>} Array of stations
   */
  async getStations() {
    const result = await stationsRepository.getAll();
    return result;
  },

  /**
   * Get a single station by ID
   * @param {string} id - Station ID
   * @returns {Promise<object|null>} Station data or null
   */
  async getStation(id) {
    const result = await stationsRepository.getOne(id);
    return result;
  },

  /**
   * Create a new radio station
   * @param {object} payload - Station data
   * @returns {Promise<string>} Station ID
   */
  async createStation(payload) {
    const newStation = {
      title: payload.title,
      location: payload.location,
      genre: payload.genre,
      img: payload.img || "",
      url: payload.url,
    };

    const stationId = await stationsRepository.create(newStation);
    return stationId;
  },
};

