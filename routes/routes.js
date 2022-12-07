const userRoutes = require("./users");
const userExpenditureRoutes = require("./user-expenditure");
const userIncomeRoutes = require("./user-income");

const appRouter = (app, fs) => {
  app.get("/", (req, res) => {
    let message = `
    welcome to the personal expense tracker server

    base_url: https://personal-expense-tracker.up.railway.app
    user routes (endpoints):
      signup: POST /auth/signup
      login: POST /auth/login
      profile: GET /user/:id

    expenditure routes (endpoints):
      get expenditures: GET /user/expenditures
      add expenditure: POST /user/expenditure
      get detail expenditure: GET /user/expenditure/:id
      delete expenditure: DELETE /user/expenditure/:id

    income routes (endpoints):
      get income: GET /user/income
      add expenditure: POST /user/income
      get detail expenditure: GET /user/income/:id
      delete expenditure: DELETE /user/income/:id
    `;
    res.send(message);
  });

  userRoutes(app, fs);
  userExpenditureRoutes(app, fs);
  userIncomeRoutes(app, fs);
};

module.exports = appRouter;
