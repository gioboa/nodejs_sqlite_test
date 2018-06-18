const sqlite3 = require('sqlite3').verbose();
const fastify = require('fastify')();
const database = './db/sample.db';

const createDb = () => {
  let db = new sqlite3.Database(database);
  db.run('CREATE TABLE clients(id INTEGER PRIMARY KEY AUTOINCREMENT, name text, surname text)');
  db.close();
};

const insertData = request => {
  let db = new sqlite3.Database(database);
  let sql = `INSERT INTO clients (name, surname) VALUES ("${request.body.name}","${request.body.surname}")`;
  db.run(sql, err => {
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

fastify.post('/create', async (request, reply) => {
  reply.type('application/json').code(200);
  createDb();
  return { result: 'OK' };
});

fastify.post('/list', async (request, reply) => {
  reply.type('application/json').code(200);
  insertData(request);
  return { result: 'OK' };
});

fastify.get('/list', async (request, reply) => {
  reply.type('application/json').code(200);
  return JSON.stringify(await selectClients());
});

fastify.listen(3000, '127.0.0.1', function(err) {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
