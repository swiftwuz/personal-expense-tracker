const uuid4 = require("uuid4");
const jwt = require("jsonwebtoken");

const userExpenditureRoutes = (app, fs) => {
  const dataPath = "./data/expenditure.json";

  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }
      callback();
    });
  };

  app.get("/user/expenditure", (req, res) => {
    if (!req.headers["authorization"]) {
      return res.status(401).send({ error: "Missing authentication header" });
    }

    const token = req.headers["authorization"].split(" ")[1];
    let userID;
    try {
      const decoded = jwt.verify(token, "randomString");
      userID = decoded.userId;
    } catch (err) {
      console.log(err);
      return res.status(401).send({ error: "Invalid token" });
    }

    readFile((data) => {
      const userExpenditureData = data.data.filter(
        (expenditure) => expenditure.user === userID
      );
      res.send(userExpenditureData);
    }, true);
  });

  app.post("/user/expenditure", (req, res) => {
    if (!req.headers["authorization"]) {
      return res.status(401).send({ error: "Missing authentication header" });
    }

    const token = req.headers["authorization"].split(" ")[1];
    let userID;
    try {
      const decoded = jwt.verify(token, "randomString");
      userID = decoded.userId;
    } catch (err) {
      console.log(err);
      return res.status(401).send({ error: "Invalid token" });
    }

    readFile((data) => {
      const expenditureID = uuid4();
      const obj = {
        id: expenditureID,
        category: req.body.category,
        estimatedAmount: req.body.estimatedAmount,
        nameOfItem: req.body.nameOfItem,
        user: userID,
      };
      data["data"].push(obj);

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(201).send({ message: "new expenditure added" });
      });
    }, true);
  });

  app.get("/user/expenditure/:id", (req, res) => {
    if (!req.headers["authorization"]) {
      return res.status(401).send({ error: "Missing authentication header" });
    }
    readFile((data) => {
      const expenditureData = data.data;
      const result = expenditureData.filter(function (expenditureID) {
        return expenditureID.id == req.params["id"];
      });
      let [obj] = result;
      res.status(200).send(obj);
    }, true);
  });

  app.delete("/user/expenditure/:id", (req, res) => {
    if (!req.headers["authorization"]) {
      return res.status(401).send({ error: "Missing authentication header" });
    }
    readFile((data) => {
      const expenditureID = req.params["id"];
      const expenditureData = data.data;
      for (const expenditure of expenditureData) {
        if (expenditure.id == expenditureID) {
          const filteredObjects = expenditureData.filter(
            (obj) => obj.id !== expenditure.id
          );
          data.data = [];
          data.data.push(...filteredObjects);
          writeFile(JSON.stringify(data, null, 2), () => {});
        }
      }
      res.status(200).send({ messge: "expenditure deleted" });
    }, true);
  });
};

module.exports = userExpenditureRoutes;
