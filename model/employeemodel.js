const mongoose = require("mongoose");

const employeeschema = new mongoose.Schema(
  {
    employee_id: {
      type: Number,
      require: [true, "employee id is require"],
      unique: true,
    },
    employee_name: {
      type: String,
      required: [true, "first name is require"],
    },
    salary: {
      type: Number,
      required: [true, "salary is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: [true, "gender is required"],
    },
    birth_date: {
      type: Date,
      required: [true, "date is required"],
      validate: {
        validator: function (v) {
          return !isNaN(new Date(v).getTime());
        },
        message: (props) => `${props.value} is not a valid date format!`,
      },
    },
    languages: [
      {
        type: String,
      },
    ],
    profile: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("employee", employeeschema);
