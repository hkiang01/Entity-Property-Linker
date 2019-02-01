/*jslint node: true */
"use strict";

// Server
const express = require("express");
const app = express();
const port = process.env.PORT;

// allow localhost
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// enable the API to parse application/json
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Postgres connection
const {
    Client
} = require('pg');
const client = new Client();
client.connect();

// a simple hello world route
app.get("/", function (req, res) {
    console.log("get '/' from ", req.ip);
    res.send("hello world");
});

// get all entities
app.get("/entity", function (req, res) {
    console.log("get '/entity' from ", req.ip);
    client.query("SELECT * FROM entity")
        .then((results) => res.status(200).json(results.rows))
        .catch(err => {
            console.error(err.stack);
            res.status(500).send({
                error: err.stack
            });
        });
});

// insert entity
app.post("/entity", function (req, res) {
    console.log("post '/entity' from ", req.ip);
    const name = req.body.name;
    const values = [name];
    const text = "INSERT INTO entity(id, name) VALUES(uuid_generate_v4(), $1) RETURNING *";
    client.query(text, values)
        .then(result => res.status(200).send(result.rows[0]))
        .catch(err => {
            console.error(err.stack);
            res.status(500).send({
                error: err.stack
            });
        });
});

// insert new property for a given entity
app.post("/field/:entityId", function (req, res) {
    const {
        name,
        entityId,
        sampleValue
    } = req.params.entityId;
    const values = [name, entityId, sampleValue];
    const text = "INSERT INTO property (id, name, entity_id, sample_value) VALUES (uuid_generate_v4(), $1, $2, $3) RETURNING *";
    client.query(text, values)
        .then(result => res.status(200).send(result.rows[0]))
        .catch(err => {
            console.error(err.stack);
            res.status(500).send({
                error: err.stack
            });
        });
});

// get all properties for a given entity
app.get("/field/:entityId", function (req, res) {
    const entityId = req.params.entityId;
    client.query("SELECT * FROM property WHERE entity_id = $1", [entityId])
        .then(results => res.status(200).json(results.rows))
        .catch(err => {
            console.error(err.stack);
            res.status(500).send({
                error: err.stack
            });
        });
});

app.listen(port, () => console.log(`API listening on port ${port}`));