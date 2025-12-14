import { ObjectId } from "mongodb";
import { db } from "../../../config/database.js";

export const stationsRepository = {
  /**
   * Get all radio stations
   * @returns {Promise<Array>} Array of stations
   */
  async getAll() {
    const stations = await db.getCollections().stationsCollection.find({}).toArray();
    return stations;
  },

  /**
   * Get a single station by ID
   * @param {string} id - Station ID
   * @returns {Promise<object|null>} Station data or null
   */
  async getOne(id) {
    const station = await db.getCollections().stationsCollection.findOne({ _id: new ObjectId(id) });
    return station;
  },

  /**
   * Create a new station
   * @param {object} station - Station data
   * @returns {Promise<string>} Inserted station ID
   */
  async create(station) {
    const result = await db.getCollections().stationsCollection.insertOne(station);
    return result.insertedId.toString();
  },
};

