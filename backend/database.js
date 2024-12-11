var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  }

  console.log("Connected to the SQLite database.");
  db.run(
    `CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asin TEXT,
        title TEXT,
        price DOUBLE,
        star_rating DOUBLE,
        image TEXT,
        sales_rank INTEGER,
        features TEXT,
        product_info TEXT,
        last_update INTEGER,
        CONSTRAINT asin_unique UNIQUE (asin)
    )`,
    (err) => {
      if (err) {
        // table already created
      } else {
        // table just created, creating some rows
        const insert =
          "INSERT INTO products (asin, title, price, star_rating, image, sales_rank, features, product_info, last_update) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.run(insert, [
          "B08L5W6XL6",
          "Apple iPhone 12 (128 GB) - Blau",
          "773.99",
          "4.5",
          "https://m.media-amazon.com/images/I/31ndEYs0n9L._SL160_.jpg",
          "1",
          "super schnell und toll ",
          "product_info test",
          "01-01-2021",
        ]);
      }
    }
  );
  db.run(
    `CREATE TABLE options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT,
        option TEXT,
        choices TEXT
    )`,
    (err) => {
      if (err) {
        // table already created
      } else {
        // table just created, creating some rows
        const insert =
          "INSERT INTO options (query, option, choices) VALUES (?, ?, ?)";
        db.run(insert, ["iPhone", "Speicherplatz", "64GB,120GB,256GB"]);
      }
    }
  );
  db.run(
    `CREATE TABLE questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        question TEXT,
        answer TEXT,
        likes INTEGER DEFAULT 0
    )`,
    (err) => {
      if (err) {
        // table already created
      } else {
        // table just created, creating some rows
        const insert =
          "INSERT INTO questions (product_id, question, answer) VALUES (?, ?, ?)";
        db.run(insert, ["1", "Wie viel Speicherplatz?", "64GB,120GB,256GB"]);
      }
    }
  );
});

module.exports = db;
