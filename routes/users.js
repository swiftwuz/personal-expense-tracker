const crypto = require("crypto");

const userRoutes = (app, fs) => {
  const dataPath = "./data/users.json";

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

  app.get("/users", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });

  app.get("/user/:id", (req, res) => {
    readFile((data) => {
      const userData = data.data;
      var result = userData.filter(function (userID) {
        return userID.id == req.params["id"];
      });
      let [obj] = result;
      res.status(200).send(obj);
    }, true);
  });

  app.post("/auth/signup", (req, res) => {
    readFile((data) => {
      const userID = crypto.randomUUID();
      obj = {
        id: userID,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      data["data"].push(obj);

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send({ message: "new user added" });
      });
    }, true);
  });

  app.post("/auth/login", (req, res) => {
    readFile((data) => {
      const userData = data["data"];
      var result = userData.find(function (user) {
        return (
          user.password === req.body.password && user.email === req.body.email
        );
      });
      if (result) {
        return res.status(200).send({ message: "login successful!" });
      } else {
        return res.status(400).send({ message: "invalid credentials!" });
      }
    }, true);
  });
};

module.exports = userRoutes;
