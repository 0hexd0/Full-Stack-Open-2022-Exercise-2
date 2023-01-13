require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/persons");

app.use(express.static("build"));

app.use(cors());

app.use(express.json());

morgan.token("body", function getBody(req) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return null;
  }
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req),
    ].join(" ");
  })
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const date = new Date();
  Person.find({}).then([
    (persons) => {
      response.send(
        `<p>Phonebook has info for ${
          persons.length
        } people</p><p>${date.toString()}</p>`
      );
    },
  ]);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  Person.find({ name: body.name }).then((persons) => {
    if (persons.length) {
      return response.status(400).json({
        error: "name must be unique",
      });
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      });
      person.save().then((saved) => {
        response.json(saved);
      });
    }
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((persons) => {
    if (persons.length) {
      response.json(persons[0]);
    } else {
      response.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.deleteOne({ id }).then((persons) => {
    response.status(204).end();
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
