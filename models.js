const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  name: String,
  img:{
    type: String
  },
});

module.exports = ImageModel = mongoose.model("Image", imgSchema);
