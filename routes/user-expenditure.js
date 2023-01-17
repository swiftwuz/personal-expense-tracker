const crypto = require("crypto");

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
    readFile((data) => {
      res.send(data);
    }, true);
  });

  app.post("/user/expenditure", (req, res) => {
    if (!req.headers["authorization"]) {
      return res.status(401).send({ error: "Missing authentication header" });
    }
    readFile((data) => {
      const expenditureID = crypto.randomUUID();
      obj = {
        id: expenditureID,
        category: req.body.category,
        estimatedAmount: req.body.estimatedAmount,
        nameOfItem: req.body.nameOfItem,
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
      var result = expenditureData.filter(function (expenditureID) {
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
      for (var i = 0; i < expenditureData.length; i++) {
        if (expenditureData[i].id == expenditureID) {
          const filteredObjects = expenditureData.filter(
            (obj) => obj.id !== expenditureData[i].id
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
