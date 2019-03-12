const Database = require("better-sqlite3");

const db = new Database("chat.db", {"verbose": console.log});

console.log("back/db.js");
console.dir(db);

const creationRoutine = {
  "messageTableCreationStatement": db.prepare(
`
CREATE TABLE IF NOT EXISTS messages
(
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    date varchar(255),
    username varchar(255) NOT NULL,
    content text NOT NULL
);
`.trim()
 )
};

creationRoutine.messageTableCreationStatement.run();

exports.db = db;