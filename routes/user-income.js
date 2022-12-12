const crypto = require("crypto");
const http = require("http");

const userIncomeRoutes = (app, fs) => {
  const dataPath = "./data/income.json";

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

  app.get("/user/income", (req, res) => {
    if (!req.headers["authorization"]) {
      res.status(401).send({ error: "Missing authentication header" });
    }
    readFile((data) => {
      res.send(data);
    }, true);
  });

  app.post("/user/income", (req, res) => {
    if (!req.headers["authorization"]) {
      res.status(401).send({ error: "Missing authentication header" });
    }
    readFile((data) => {
      const incomeID = crypto.randomUUID();
      obj = {
        id: incomeID,
        nameOfRevenue: req.body.nameOfRevenue,
        amount: req.body.amount,
      };
      data["data"].push(obj);

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(201).send({ message: "new income added" });
      });
    }, true);
  });

  app.get("/user/income/:id", (req, res) => {
    if (!req.headers["authorization"]) {
      res.status(401).send({ error: "Missing authentication header" });
    }
    readFile((data) => {
      const incomeData = data.data;
      var result = incomeData.filter(function (incomeID) {
        return incomeID.id == req.params["id"];
      });
      let [obj] = result;
      res.status(200).send(obj);
    }, true);
  });

  app.delete("/user/income/:id", (req, res) => {
    if (!req.headers["authorization"]) {
      res.status(401).send({ error: "Missing authentication header" });
    }
    readFile((data) => {
      const incomeID = req.params["id"];
      const incomeData = data.data;
      for (var i = 0; i < incomeData.length; i++) {
        if (incomeData[i].id == incomeID) {
          const filteredObjects = incomeData.filter(
            (obj) => obj.id !== incomeData[i].id
          );
          data.data = [];
          data.data.push(...filteredObjects);
          writeFile(JSON.stringify(data, null, 2), () => {});
        }
      }
      res.status(200).send({ messge: "income deleted" });
    }, true);
  });
};

module.exports = userIncomeRoutes;
