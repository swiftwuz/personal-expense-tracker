const userRoutes = require("./users");
const userExpenditureRoutes = require("./user-expenditure");
const userIncomeRoutes = require("./user-income");

const appRouter = (app, fs) => {
  app.get("/", (req, res) => {
    res.send("welcome to the personal expense tracker API");
  });

  userRoutes(app, fs);
  userExpenditureRoutes(app, fs);
  userIncomeRoutes(app, fs);
};

module.exports = appRouter;
