const mongoose = require("mongoose");
const app = require("./app");

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
const PORT = process.env.PORT || 3000;
const dbConnectionUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.lrw8jku.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

// db connection
mongoose.connect(dbConnectionUrl, clientOptions).then((con) => {
  console.log("You successfully connected to MongoDB!");
});

// server listening
const server = app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(
    "getting error during connection establishment -",
    err.name,
    err.message
  );
  console.log("Unhandled Rejection 🔥, shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception...");
  console.log(err.name, err.message);
  process.exit(1);
});
