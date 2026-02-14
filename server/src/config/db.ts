import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const isDev = process.env.NODE_ENV === 'development';

    const mongoUri = isDev 
      ? process.env.LOCAL_MONGO_URI 
      : process.env.PROD_MONGO_URI;

    if (!mongoUri) {
      throw new Error(`Mongo URI for ${process.env.NODE_ENV} is not defined in .env`);
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`---`);
    console.log(`🌐 ENV: ${process.env.NODE_ENV?.toUpperCase()}`);
    console.log(`📦 DB: ${conn.connection.name}`);
    console.log(`🏠 HOST: ${conn.connection.host}`);
    console.log(`---`);

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;