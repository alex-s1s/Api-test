const express = require("express");
const mongoose = require("mongoose");
const Data = require("./models/Data");
const cors = require("cors");

const app = express();

mongoose
  .connect(
    "mongodb+srv://{token}"
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
  res.header("Access-Control-Allow-Origin", "*");
  //Quais são os métodos que a conexão pode realizar na API
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  app.use(cors());
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Oi Express!" });
});

//post enviando dados

app.post("/data", async (req, res) => {
  const { email, name, description } = req.body;
  const data = {
    email,
    name,
    description,
  };
  try {
    await Data.create(data);
    res.status(201).json({ message: "Dados inseridos com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

//Requisicao GET

app.get("/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

//Requisicao de dados específicos
app.get("/data/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Data.findOne({ _id: id });
    if (!data) {
      res.status(422).json({ message: "Dados não encontrados!" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

//Método Post
app.patch("/data/:id", async (req, res) => {
  const id = req.params.id;
  const { email, name, description } = req.body;
  const data = {
    email,
    name,
    description,
  };
  try {
    const updatedData = await Data.updateOne({ _id: id }, data);
    if (updatedData.matchedCount === 0) {
      res.status(422).json({ message: "Dados não encontrados!" });
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

// Delete
app.delete("/data/:id", async (req, res) => {
  const id = req.params.id;
  const data = await Data.findOne({ _id: id });
  if (!data) {
    res.status(422).json({ message: "Dados não encontrados!" });
    return;
  }
  try {
    await Data.deleteOne({ _id: id });
    res.status(200).json({ message: "Dado removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

app.listen(3003);
