const { uuid } = require("uuidv4");
const jwt = require("jsonwebtoken");
const uuid4 = require("uuid4");

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

  app.get("/auth/user/:id/profile", (req, res) => {
    readFile((data) => {
      const userData = data.data;
      const result = userData.filter(function (userID) {
        return userID.id == req.params["id"];
      });
      let [obj] = result;
      res.status(200).send(obj);
    }, true);
  });

  app.post("/auth/signup", (req, res) => {
    readFile((data) => {
      const userID = uuid4();
      const obj = {
        id: userID,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      data["data"].push(obj);

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(201).send({ message: "new user added" });
      });
    }, true);
  });

  app.post("/auth/login", (req, res) => {
    readFile((data) => {
      const userData = data["data"];
      const user = userData.find(function (user) {
        return (
          user.password === req.body.password && user.email === req.body.email
        );
      });
      if (user) {
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          "randomString",
          { expiresIn: "2h" }
        );
        return res.status(200).send({
          message: "login successful!",
          accessToken: token,
          expiresIn: "2 hours",
        });
      } else {
        return res.status(400).send({ message: "invalid credentials!" });
      }
    }, true);
  });
};

module.exports = userRoutes;
