const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const employee = require("../model/employeemodel");
const employeecontroller = require("./../controllers/employeecontroller");
require("multer");
const { upload } = require("../Middleware/malter"); // Import multer configuration
const express = require("express");
const router = express.Router();

router.get("/submit-form", employeecontroller.get);
router.post(
  "/submit-form",
  upload.single("profile"),
  employeecontroller.create,
);

router.get("/", async (req, res) => {
  try {
    const employees = await employee.find(); // Fetch all employees from DB
    res.render("showemp", { employees }); // Render showemp.ejs with employees data
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/showemp", multipartMiddleware, employeecontroller.getallemployee);

//update
router.get(
  "/updateData/:id",
  upload.single("profile"),
  multipartMiddleware,
  employeecontroller.updatebyid,
);

router.post("/update/:id", upload.single("profile"), employeecontroller.update);

//view
router.get(
  "/view/:id",
  upload.single("profile"),
  multipartMiddleware,
  employeecontroller.view,
);

//delete
router.post("/delete/:id", multipartMiddleware, employeecontroller.delete);

module.exports = router;
