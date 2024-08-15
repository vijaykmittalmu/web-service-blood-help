const mongoose = require("mongoose");
const app = require("./app");

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
const PORT = process.env.PORT || 3000;
const dbConnectionUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.lrw8jku.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

// db connection
mongoose
  .connect(dbConnectionUrl, clientOptions)
  .then((con) => {
    console.log("You successfully connected to MongoDB!");
  })
  .catch((err) => {
    console.log("getting error during connection establishment ", err);
  });

// server listening
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
