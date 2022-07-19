const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const port = 5000;
// const fs = require("fs");
const imageModel = require("./models");
const path = require('path')

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


mongoose
  .connect(
    "mongodb+srv://anish:1234@Cluster0.ojhq1.mongodb.net/image?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected successfully"))
  .catch((err) => console.log("it has an error", err));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null,new Date().getTime() + file.originalname);
  },
});
// Multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};


const upload = multer({ storage: storage,fileFilter: multerFilter, });

app.post("/", upload.single("testImage"), (req, res) => {
  const saveImage =  imageModel({
    name: req.body.name,
    img:req.file.filename,
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
    res.send('image is saved')
});

// get all 
app.get('/',async(req,res)=>{
  const data = await imageModel.find()
  res.json(data)
})
// specific resume
app.get('/get/:_id',async (req,res)=>{
  const id = req.params._id
  if(id){
    const allData = await imageModel.findOne({
      _id:id
    })
    // console.log(allData.img)
    // res.sendFile(`./uploads/${allData.img}`,{ root: __dirname });
    res.sendFile(`/${allData.img}`,{ root: path.join(__dirname, './uploads') });
  }
  else{
    res.json('something wrong')
  }
})


app.listen(port, () => {
  console.log("server running successfully");
});
