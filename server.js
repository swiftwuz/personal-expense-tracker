const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const cors = require("cors");

const swaggerUI = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const routes = require("./routes/routes.js")(app, fs);

const server = app.listen(3000, () => {
  console.log("listening on port %s...", server.address().port);
});
