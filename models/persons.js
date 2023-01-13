const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.statics.deleteById = function (_id) {
  return this.deleteOne({ _id: _id });
};

module.exports = mongoose.model("Person", personSchema);
