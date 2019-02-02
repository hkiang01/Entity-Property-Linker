"use strict";

// Postgres connection
const { Client } = require("pg");
const client = new Client();
client.connect();

// API server
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT;

// allow basic CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// enable the API to parse application/json
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// a simple hello world route
app.get("/", function(req, res) {
  console.log("get '/' from ", req.ip);
  res.send("hello world");
});

// TODO: put entity routes in separate file

// get all entities
app.get("/entity", function(req, res) {
  console.log("get '/entity' from", req.ip);
  client
    .query("SELECT * FROM entity")
    .then(results => res.status(200).json(results.rows))
    .catch(err => {
      console.error(err.stack);
      res.status(500).send({
        error: err.stack
      });
    });
});

// insert entity
app.post("/entity", function(req, res) {
  console.log("post '/entity' from", req.ip);
  const name = req.body.name;
  const values = [name];
  const text =
    "INSERT INTO entity(id, name) VALUES(uuid_generate_v4(), $1) RETURNING *";
  client
    .query(text, values)
    .then(result => res.status(200).send(result.rows[0]))
    .catch(err => {
      console.error(err.stack);
      res.status(500).send({
        error: err.stack
      });
    });
});

// delete entity
app.options("/entity", cors()); // enable pre-flight request for DELETE request
app.delete("/entity", function(req, res) {
  console.log("delete '/entity' from", req.ip);
  const { id, name } = req.body;
  const values = [id, name];
  const text = "DELETE FROM entity WHERE id=$1 AND name=$2 RETURNING *";
  client
    .query(text, values)
    .then(result => res.status(200).send(result.rows[0]))
    .catch(err => {
      console.error(err.stack);
      res.status(500).send({
        error: err.stack
      });
    });
});

// TODO: put property routes in separate file

// get all properties
app.get("/property", function(req, res) {
  console.log("get '/property' from", req.ip);
  client
    .query("SELECT * FROM property")
    .then(results => res.status(200).json(results.rows))
    .catch(err => {
      console.error(err.stack);
      res.status(500).send({
        error: err.stack
      });
    });
});

// insert new property by name and sample value
app.post("/property", function(req, res) {
  console.log("post '/property' from", req.ip);
  const { name } = req.body;
  const values = [name];
  const text =
    "INSERT INTO property(id, name) VALUES(uuid_generate_v4(), $1) RETURNING *";
  client
    .query(text, values)
    .then(result => res.status(200).send(result.rows[0]))
    .catch(err => {
      console.error(err.stack);
      res.status(500).send({
        error: err.stack
      });
    });
});

// delete property
app.options("/property", cors()); // enable pre-flight request for DELETE request
app.delete("/property", function(req, res) {
  console.log("delete '/property' from", req.ip);
  const { id, name } = req.body;
  const values = [id, name];
  const text = "DELETE FROM property WHERE id=$1 AND name=$2 RETURNING *";
  client
    .query(text, values)
    .then(result => res.status(200).send(result.rows[0]))
    .catch(err => {
      console.error(err.stack);
      res.status(500).send({
        error: err.stack
      });
    });
});

app.listen(port, () => console.log(`API listening on port ${port}`));
