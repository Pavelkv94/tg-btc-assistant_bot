import { MongoClient } from "mongodb";

export const db = {
  client: {},
  getDbName() {
    return this.client.db(process.env.DB_NAME);
  },
  async run(url) {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      await this.getDbName().command({ ping: 1 });
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      await this.client.close();
      console.log(`❌ Mongo connect Error: ${error}`);
      throw error;
    }
  },
  async stop() {
    await this.client.close();
    console.log("Mongo connection closed");
  },
  async drop() {
    try {
      const collections = await this.getDbName().listCollections().toArray();

      for (const collection of collections) {
        const collectionName = collection.name;
        await this.getDbName().collection(collectionName).deleteMany({});
      }
    } catch (error) {
      console.log("Mongo drop db Error: " + error);
      await this.stop();
    }
  },
  async dropCollection(collectionName) {
    try {
      await this.getDbName().collection(collectionName).deleteMany({});
    } catch (error) {
      console.log("Mongo drop collection Error: " + error);
      await this.stop();
    }
  },
  getCollections() {
    return {
      stationsCollection: this.getDbName().collection("stations"),
      usersCollection: this.getDbName().collection("users"),
    };
  },
};

