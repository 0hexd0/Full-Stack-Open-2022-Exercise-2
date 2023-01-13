const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}\-\d*$/.test(v) || /^\d{8,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    minLength: 8,
  },
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
