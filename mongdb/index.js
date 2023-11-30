express = require("express");
router = express.Router();
mongoclient = require("mongodb").MongoClient;
mongoclient.connect(
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
  { useUnifiedTopology: true },
  function (err, client) {
    if (err) throw err;
    console.log("connected successfully to mongo");
    db = client.db("Newwatches");
  }
);
router.get("/", (req, res) => {
  db.collection("watch")
    .find({ model_no: "TT001" })
    .toArray(function (err, docs) {
      if (err) throw err;
      res.send(docs);
      console.log(docs);
    });
});
router.get("/post-details", (req, res) => {
  db.collection("watch").insertOne(
    { nodel_no: "TT001", model_name: "TITAN", model_price: "12000" },
    function (err, docs) {
      if (err) throw err;
      res.send("inserted succesfully to db");
      res.send(res);
    }
  );
});
router.get("/update-details", (req, res) => {
  db.collection("watch").updateOne(
    { model_no: "TT001" },
    { $set: { model_price: "10000" } },
    function (err, docs) {
      if (err) throw err;
      res.send("updated successfully");
    }
  );
});
module.exports = router;
