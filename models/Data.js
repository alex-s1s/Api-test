const mongoose = require("mongoose");

const Data = mongoose.model("Data", {
  email: String,
  name: String,
  description: String,
});

module.exports = Data;
