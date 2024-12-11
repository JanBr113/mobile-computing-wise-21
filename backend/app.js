const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const app = express();
const AmazonUtils = require("./external-API/amazonPaapi");
const ai = require("./external-API/gpt3");
const question_ai = require("./external-API/gpt3-questions");
async function searchProductsByKeyword(keyword) {
  let data = await AmazonUtils.getItemsFromAmazonByKeyword(keyword);

  return data;
}

async function getKI(keyword) {
  let data = await ai.getProductOptions(keyword);

  return data;
}

async function getFragenKI(product_data, question) {
  let data = await question_ai.getAnswersToProductQuestions(
    product_data,
    question
  );

  return data;
}

function createDictionary(string) {
  var dictionary = {};
  var options = string.split("\n-\nOption: ");
  try {
    for (var i = 1; i < options.length; i++) {
      var option = options[i].split("\nMöglichkeiten: ");
      dictionary[option[0]] = option[1].split(";");
    }
  } catch (error) {
    console.log("Fehler: " + error);
    reject(error);
  }
  return dictionary;
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/api/products", (request, response, next) => {
  const sql = "select * from products";
  const params = [];
  db.all(sql, params, (err, products) => {
    if (err) {
      response.status(400).json({
        error: err.message,
      });
      return;
    }

    response.status(200).json({
      products: products,
    });
  });
});

// get product by id
app.get("/api/products/:id", (request, response, next) => {
  const sql = "select * from products where id = ?";
  const params = [request.params.id];
  db.get(sql, params, (err, product) => {
    if (err) {
      response.status(400).json({
        error: err.message,
      });
      return;
    }

    response.status(200).json({
      ...product,
    });
  });
});

// get options and choices by keyword
app.get("/api/options/search/:keyword", (request, response, next) => {
  const sql = "select * from options where query like ?";
  const params = ["%" + request.params.keyword + "%"];
  db.all(sql, params, (err, options) => {
    if (err) {
      response.status(400).json({
        error: err.message,
      });
      return;
    }
    if (options.length === 0) {
      console.log(
        request.params.keyword + " ist noch nicht in DB. Holt Optionen von gpt3"
      );
      getKI(request.params.keyword).then((data) => {
        let optionsAndChoices = createDictionary(data);
        let options = Object.keys(optionsAndChoices);
        let choices = Object.values(optionsAndChoices);
        for (let i = 0; i < options.length; i++) {
          let option = options[i];
          let query = request.params.keyword;
          let choice = choices[i];
          console.log("option:" + option);
          console.log("choices: " + choice);
          let sql =
            "insert into options (option, query, choices) values (?, ?, ?)";
          let params = [option, query, choice];
          db.run(sql, params, (err) => {
            if (err) {
              response.status(400).json({
                error: err.message,
              });
              return;
            }
          });
        }
        db.all(sql, params, (err, options) => {
          if (err) {
            response.status(400).json({
              error: err.message,
            });
            return;
          }
          response.status(200).json({
            options: options,
          });
        });
      });
    } else {
      response.status(200).json({
        options: options,
      });
    }
  });
});

// get product by keyword in a title
app.get("/api/products/search/:keyword", (request, response, next) => {
  const sql = "select * from products where title like ?";
  const params = ["%" + request.params.keyword + "%"];
  db.all(sql, params, (err, products) => {
    if (err) {
      response.status(400).json({
        error: err.message,
      });
      return;
    }
    if (products.length === 0) {
      console.log(
        request.params.keyword + " ist noch nicht in DB. Holt Produkt von paapi"
      );
      searchProductsByKeyword(request.params.keyword).then((data) => {
        let products = data.SearchResult.Items;
        for (let i = 0; i < products.length; i++) {
          let product = products[i];
          let asin = product.ASIN;
          let title = product.ItemInfo.Title.DisplayValue;
          let image = product.Images.Primary.Large.URL;
          let price = [];
          if (product.Offers) {
            price = product.Offers.Listings[0].Price.Amount;
          }
          let star_rating = [];
          if (product.CustomerReviews) {
            star_rating = product.CustomerReviews.StarRating.Value;
          }
          let sales_rank = [];
          if (product.BrowseNodeInfo) {
            sales_rank = product.BrowseNodeInfo.BrowseNodes[0].SalesRank;
          }
          let features = [];
          if (product.ItemInfo.Features) {
            features = product.ItemInfo.Features.DisplayValues;
          }
          let product_info = [];
          if (product.ItemInfo.ProductInfo) {
            product_info = product.ItemInfo.ProductInfo;
          }
          let last_update = Date.now();
          let sql =
            "insert into products (image, title, asin, price, star_rating, sales_rank, features, product_info, last_update) values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
          let params = [
            image,
            title,
            asin,
            price,
            star_rating,
            sales_rank,
            features,
            product_info,
            last_update,
          ];
          db.run(sql, params, (err) => {
            if (err) {
              response.status(400).json({
                error: err.message,
              });
              return;
            }
          });
        }
        db.all(sql, params, (err, products) => {
          if (err) {
            response.status(400).json({
              error: err.message,
            });
            return;
          }
          response.status(200).json({
            products: products,
          });
        });
      });
    } else {
      response.status(200).json({
        products: products,
      });
    }
  });
});

app.post("/api/products/", (request, response, next) => {
  const requiredProperties = ["asin", "title", "price", "last_update"];
  const errors = [];

  requiredProperties.forEach((property) => {
    if (!request.body[property]) {
      errors.push(`Required property ${property} is missing`);
    }
  });

  if (errors.length) {
    response.status(400).json({
      error: errors.join(", "),
    });
    return;
  }

  const data = {
    asin: request.body.asin,
    title: request.body.title,
    price: request.body.price,
    star_rating: request.body.star_rating,
    image: request.body.image,
    sales_rank: request.body.sales_rank,
    features: request.body.features,
    product_info: request.body.product_info,
    last_update: request.body.last_update,
  };

  const sql =
    "INSERT INTO products (asin, title, price, star_rating, image, sales_rank, features, product_info, last_update) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const params = [
    data.asin,
    data.title,
    data.price,
    data.star_rating,
    data.image,
    data.sales_rank,
    data.features,
    data.product_info,
    data.last_update,
  ];
  db.run(sql, params, function (err, result) {
    if (err) {
      response.status(400).json({ error: err.message });
      return;
    }
    response.status(201).json({
      message: "success",
      product: {
        ...data,
        id: this.lastID,
      },
    });
  });
});

// get answers to product questions
app.get(
  "/api/answers/product/:product_id/:question",
  (request, response, next) => {
    const sql = "select * from questions where product_id = ? and question = ?";
    const params = [request.params.product_id, request.params.question];
    db.get(sql, params, (err, answer) => {
      if (err) {
        response.status(400).json({
          error: err.message,
        });
        return;
      }
      if (answer === undefined || answer === null) {
        console.log(
          "noch keine Antwort zu " +
            request.params.product_id +
            " und " +
            request.params.question +
            " in DB. Holt Antwort von gpt3"
        );
        // product Daten aus Datenbank laden mit hilfe von product_id
        let product_data = {};
        let sql = "select * from products where id = ?";
        let params = [request.params.product_id];
        db.get(sql, params, (err, product) => {
          if (err) {
            response.status(400).json({
              error: err.message,
            });
            console.log("FEHLER!!!");
            return;
          }
          product_data = product;
          console.log(
            "BACKEND APP.js Produkt Data \n" + JSON.stringify(product_data)
          );
          // Antwort von gpt3 holen
          getFragenKI(product_data, request.params.question).then((data) => {
            let answer = data;
            console.log(answer);
            let sql =
              "insert into questions (product_id, question, answer) values (?, ?, ?)";
            let params = [
              request.params.product_id,
              request.params.question,
              answer,
            ];
            db.run(sql, params, (err) => {
              if (err) {
                response.status(400).json({
                  error: err.message,
                });
                return;
              }
            });
            // get updated database entry
            sql =
              "select * from questions where product_id = ? and question = ?";
            params = [request.params.product_id, request.params.question];
            db.get(sql, params, (err, answer) => {
              if (err) {
                response.status(400).json({
                  error: err.message,
                });
                return;
              }
              response.status(200).json({
                answer: answer,
              });
            });
          });
        });
      } else {
        response.status(200).json({
          answer: answer,
        });
      }
    });
  }
);

app.patch("/api/products/:id", (request, response, next) => {
  const data = {
    asin: request.body.asin,
    title: request.body.title,
    price: request.body.price,
    star_rating: request.body.star_rating,
    image: request.body.image,
    sales_rank: request.body.sales_rank,
    features: request.body.features,
    product_info: request.body.product_info,
    last_update: request.body.last_update,
  };

  const sql =
    "UPDATE products SET asin = COALESCE(?, asin), title = COALESCE(?, title), price = COALESCE(?, price), star_rating = COALESCE(?, star_rating), image = COALESCE(?, image), sales_rank = COALESCE(?, sales_rank), features = COALESCE(?, features), product_info = COALESCE(?, product_info), last_update = COALESCE(?, last_update) WHERE id = ?";
  const params = [
    data.asin,
    data.title,
    data.price,
    data.star_rating,
    data.image,
    data.sales_rank,
    data.features,
    data.product_info,
    data.last_update,
    request.params.id,
  ];

  db.run(sql, params, function (err, result) {
    if (err) {
      response.status(400).json({ error: err.message });
      return;
    }
    response.status(200).json({
      product: data,
      changes: this.changes,
    });
  });
});

app.delete("/api/products/:id", (request, response, next) => {
  const sql = "DELETE FROM products WHERE id = ?";
  const params = [request.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      response.status(400).json({ error: err.message });
      return;
    }
    response.status(200).json({
      message: "deleted",
      changes: this.changes,
    });
  });
});

// add like to questions
app.patch("/api/questions/like/:id", (request, response, next) => {
  const sql = "update questions set likes = likes + 1 where id = ?";
  const params = [request.params.id];
  db.run(sql, params, (err) => {
    if (err) {
      response.status(400).json({
        error: err.message,
      });
      return;
    }
    const sql = "select likes from questions where id = ?";
    const params = [request.params.id];
    db.get(sql, params, (err, likes) => {
      if (err) {
        response.status(400).json({
          error: err.message,
        });
        return;
      }
      response.status(200).json({
        likes: likes,
      });
    });
  });
});

// remove like from questions
app.patch("/api/questions/dislike/:id", (request, response, next) => {
  const sql = "update questions set likes = likes - 1 where id = ?";
  const params = [request.params.id];
  db.run(sql, params, (err) => {
    if (err) {
      response.status(400).json({
        error: err.message,
      });
      return;
    }
    const sql = "select likes from questions where id = ?";
    const params = [request.params.id];
    db.get(sql, params, (err, likes) => {
      if (err) {
        response.status(400).json({
          error: err.message,
        });
        return;
      }
      response.status(200).json({
        likes: likes,
      });
    });
  });
});

// delete question
app.delete("/api/questions/:id", (request, response, next) => {
  const sql = "DELETE FROM questions WHERE id = ?";
  const params = [request.params.id];
  db.run(sql, params, (err, result) => {
    if (err) {
      response.status(400).json({
        error: err.message,
      });
      return;
    }
    response.status(200).json({
      message: "deleted",
    });
  });
});

module.exports = app;
