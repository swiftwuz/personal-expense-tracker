const uuid4 = require("uuid4");
const jwt = require("jsonwebtoken");

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
      const userIncomeData = data.data.filter(
        (income) => income.user === userID
      );
      res.send(userIncomeData);
    }, true);
  });

  app.post("/user/income", (req, res) => {
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

    console.log(userID);
    readFile((data) => {
      const incomeID = uuid4();
      const obj = {
        id: incomeID,
        nameOfRevenue: req.body.nameOfRevenue,
        amount: req.body.amount,
        user: userID,
      };
      data["data"].push(obj);

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(201).send({ message: "new income added" });
      });
    }, true);
  });

  app.get("/user/income/:id", (req, res) => {
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
      const userIncomeData = data.data.filter(
        (income) => income.user === userID
      );

      const result = userIncomeData.filter(function (incomeID) {
        return incomeID.id == req.params["id"];
      });

      let [obj] = result;

      res.status(200).send(obj);
    }, true);
  });

  app.delete("/user/income/:id", (req, res) => {
    if (!req.headers["authorization"]) {
      return res.status(401).send({ error: "Missing authentication header" });
    }

    readFile((data) => {
      const incomeID = req.params["id"];
      const incomeData = data.data;
      for (const entry of incomeData) {
        if (entry.id == incomeID) {
          const filteredObjects = incomeData.filter(
            (obj) => obj.id !== entry.id
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
