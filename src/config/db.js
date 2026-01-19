import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1); // app band kar do agar DB na mile
  }
};

export default connectDB;
