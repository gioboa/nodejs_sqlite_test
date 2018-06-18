const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const database = './db/sample.db';

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('static'));

app.get('/status', function(req, res) {
  res.send('Server Running!');
});

const createDb = () => {
  let db = new sqlite3.Database(database);
  db.run('CREATE TABLE clients(id INTEGER PRIMARY KEY AUTOINCREMENT, name text, surname text)');
  db.close();
};

const insertData = request => {
  console.log(`insertData ${request.body.surname}`);
  let db = new sqlite3.Database(database);
  let sql = `INSERT INTO clients (name, surname) VALUES ("${request.body.name}","${request.body.surname}")`;
  db.run(sql, err => {
    if (err) {
      return console.error(err.message);
    }
  });
  db.close();
};

const clearData = request => {
  let db = new sqlite3.Database(database);
  db.run(`DELETE FROM clients`, err => {
    if (err) {
      return console.error(err.message);
    }
  });
  db.close();
};

const selectClients = async () => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(database);
    let sql = `SELECT name, surname FROM clients`;
    var clients = [];
    db.each(
      sql,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          clients.push({ name: row.name, surname: row.surname });
        }
      },
      (err, n) => {
        if (err) {
          reject(err);
        } else {
          resolve(clients);
        }
      }
    );
  });
};

app.post('/create', (req, res) => {
  createDb();
  res.send(JSON.parse('{"result": "ok"}'));
});

app.post('/clear', (req, res) => {
  clearData();
  res.send(JSON.parse('{"result": "ok"}'));
});

app.post('/list', (req, res) => {
  insertData(req);
  res.send(JSON.parse('{"result": "ok"}'));
});

app.get('/list', async (req, res) => {
  const data = await selectClients();
  res.send(data);
});

app.use(express.static(__dirname + '/dist'));
app.listen(process.env.PORT || 8080);
