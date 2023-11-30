const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const Note = require("../models/Note");

//Route1:  Fetch all the notes :GET:"/api/notes/fetchallnotes". No login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route2:  Add new notes :POST:"/api/notes/addnode". No login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("name", "Enter name"),
    body("gender", "Select correct gender"),
    body("age", "Enter the valid age").isLength({ min: 1 }),
    body("phonenumber", "Enter the valid phone number with 10 digits").isLength(
      { min: 10 }
    ),
    body("address", "Enter the valid address").isLength({ min: 5 }),
    body("info", "Enter the valid Information"),
    body("appdate", "Enter the valid appointment date"),
    body("department", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const {
        name,
        gender,
        age,
        phonenumber,
        address,
        info,
        appdate,
        department,
      } = req.body;
      //if there are errors return bad request and the errors

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        name,
        gender,
        age,
        phonenumber,
        address,
        info,
        appdate,
        department,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route3:  Updating an existing notes :PUT:"/api/notes/updatenote".  login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { name, gender, age, phonenumber, address, info, appdate, department } =
    req.body;
  try {
    //Create a new note object
    const newNote = {};
    if (name) {
      newNote.name = name;
    }
    if (gender) {
      newNote.gender = gender;
    }
    if (age) {
      newNote.age = age;
    }
    if (phonenumber) {
      newNote.phonenumber = phonenumber;
    }
    if (address) {
      newNote.address = address;
    }
    if (info) {
      newNote.info = info;
    }
    if (appdate) {
      newNote.appdate = appdate;
    }

    if (department) {
      newNote.department = department;
    }

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route4:  Deleting an existing notes :DELETE:"/api/notes/deletenote".  login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // const { gender, age, phonenumber, address, info, department } = req.body;
    // //Create a new note object

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    //Allow deletion only if user owns this string
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been Deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
