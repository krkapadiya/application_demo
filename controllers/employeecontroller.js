const mongoose = require("mongoose");
require("../Middleware/malter.js");
const employee = require("../model/employeemodel");
require(`./../DB/conn`);

const { errorRes, successRes } = require(`../response/msgcode.js`);

const employeecontroller = {

  getallemployee: async (req, res) => {
    try {

      const employees = await employee.find().sort({ createdAt: -1 });

      res.render("showemp", { employees });
    } catch (error) {
      console.error("Error fetching employees:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  get: async (req, res) => {
    res.render("index");
  },

  //create
  create: async (req, res) => {
    try {
      const {
        employee_id,
        employee_name,
        salary,
        gender,
        birth_date,
        languages,
      } = req.body;

      const languageArray = Array.isArray(languages) ? languages : [languages];
      console.log("Languages received:", languages);

      let imagefilename = null;
      if (req.file) {
        console.log("File received:", req.file);
        imagefilename = `uploads/${req.file.filename}`;
      } else {
        console.log("No file received, will use default image.");
      }

      const existingEmployee = await employee.findOne({ employee_id });
      if (existingEmployee) {
        return res.render("index", {
          errorMessage: "Employee ID already exists! Please choose another.",
        });
      }

      const employeedata = new employee({
        employee_id,
        employee_name,
        salary,
        gender,
        birth_date,
        languages: languageArray,
        profile: imagefilename, // This will be null if no file is uploaded
      });

      await employeedata.save();
      res.redirect("/showemp");
    } catch (error) {
      console.error("Internal Server Error:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID format");
      }

      // Proceed with deleting the employee
      const deletedEmployee = await employee.findByIdAndDelete(id);

      if (!deletedEmployee) {
        return successRes(res, 200, "employee deleted successfully");
      }

      res.redirect("/showemp"); // Redirect back to the employee list
    } catch {
      return errorRes(res, 500);
    }
  },

  updatebyid: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Received Employee ID:", id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid Employee ID format");
      }

      // Fetch employee from the database using `_id`
      const employeeData = await employee.findOne({ _id: id });

      // Check if employee exists
      if (!employeeData) {
        return res.status(404).send("Employee not found");
      }

      console.log("Fetched Employee Data:", employeeData);

      // Render update page with employee data
      res.render("updateemp", { employee: employeeData });
    } catch (error) {
      console.error("Error fetching employee:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Route to handle updating employee details
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { employee_name, salary, gender, birth_date, languages } = req.body;

      console.log("Received Employee ID:", id);
      console.log("Request Body:", req.body);

      const validGenders = ["male", "female"];
      const genderValue = validGenders.includes(gender) ? gender : "male"; // Default

      // Ensure languages is an array
      const languageArray =
        typeof languages === "string"
          ? languages.split(",").map((lang) => lang.trim())
          : [];

      // Prepare update data
      let updatedata = {
        employee_name,
        salary,
        gender: genderValue,
        birth_date,
        languages: languageArray,
      };

      // If a new profile image is uploaded
      if (req.file) {
        console.log("New Image:", req.file.filename);
        updatedata.profile = `uploads/${req.file.filename}`;
      }

      // Update the employee document
      await employee.findOneAndUpdate(
        { _id: id }, // Ensure correct field
        { $set: updatedata },
        { new: true },
      );
      // Redirect to show employee page
      res.redirect("/showemp");
    } catch (error) {
      console.error("Update error:", error.message);
      return errorRes(res, 500, error.message);
    }
  },

  view: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Received Employee ID:", id);

      // Ensure `id` is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid Employee ID format");
      }

      // Fetch employee from the database using `_id`
      const employeeData = await employee.findOne({ _id: id });

      // Check if employee exists
      if (!employeeData) {
        return res.status(404).send("Employee not found");
      }

      console.log("Fetched Employee Data:", employeeData);

      // Render update page with employee data
      res.render("view", { employee: employeeData });
    } catch (error) {
      console.error("Error fetching employee:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = employeecontroller;
