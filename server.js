const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "todos",
  process.env.DB_USER || "todos",
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    pool: {
      max: 10,
      min: 1,
    },
  }
);
const Todo = sequelize.define("todo", {
  title: {
    type: Sequelize.STRING,
  },
  completed: {
    type: Sequelize.BOOLEAN,
  },
});

sequelize.sync().then(() => {
  Todo.count({ title: { [Sequelize.Op.Eq]: "Something" } }).then(
    (itemCount) => {
      if (itemCount === 0) {
        Todo.create({ title: "Something", completed: false });
      }
    }
  );
});

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/todos", (req, res) => {
  Todo.findAll()
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
