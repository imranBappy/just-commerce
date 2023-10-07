import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error(
    "Please define the MONGODB URI (MONGO_URI) environment variable inside .env.local",
  );
}

const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
