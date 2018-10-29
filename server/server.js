const express = require("express");
const app = express();
const port = 5000;
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const queryText =
    `CREATE TABLE IF NOT EXISTS
      reflections(
        id UUID PRIMARY KEY,
        success VARCHAR(128) NOT NULL,
        low_point VARCHAR(128) NOT NULL,
        take_away VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

pool.query(queryText)
  .then((res) => {
    console.log(res);
    pool.end();
  })
  .catch((err) => {
    console.log(err);
    pool.end();
  });

app.listen(port, () => console.log(`The server is running on port ${port}`));

app.get("/customers", (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Mary', lastName: 'Adams'},
    {id: 3, firstName: 'Richard', lastName: 'Smith'}
  ];

  res.json(customers);
});
