const mongoose = require("mongoose");
const MONGOOURI =
  "mongodb+srv://sabana:diktaBagus95>@cluster0.mcc5i.gcp.mongodb.net/sabana?retryWrites=true&w=majority";
const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOOURI, {
      useNewUrlParser: true,
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
