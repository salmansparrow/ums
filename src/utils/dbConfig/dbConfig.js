import mongoose from "mongoose";

export async function dbConnect() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB Connected");
    });

    connection.on("error", (error) => {
      console.log(
        " MONGODB Connection error. please make sure db is up and running " +
          error
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong in connecting DB");
    console.log(error);
  }
}
