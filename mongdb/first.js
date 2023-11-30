express = require("express");
app = express();
std_router = require("./index.js");
app.get("/", std_router);
app.get("/post-details", std_router);
app.get("/update-details", std_router);
port = 3000;
app.listen(port, () => {
  console.log("server started at port ", port);
});
