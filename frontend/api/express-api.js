const API_BACKEND_URL = "http://localhost:8080/api";

export function getProducts() {
  return fetch(`${API_BACKEND_URL}/products`).then((response) =>
    response.json()
  );
}

export function getProduct(id) {
  return fetch(`${API_BACKEND_URL}/products/${id}`).then((response) =>
    response.json()
  );
}

export function getProductByKeyword(keyword) {
  return fetch(`${API_BACKEND_URL}/products/search/${keyword}`).then(
    (response) => response.json()
  );
}

export function getOptionsByKeyword(keyword) {
  return fetch(`${API_BACKEND_URL}/options/search/${keyword}`).then(
    (response) => response.json()
  );
}

export function getAnswersToProductQuestions(product, question) {
  console.log(
    "frontend express-api.js : product id: " +
      product.id +
      "   \nQuestion:" +
      question
  );
  return fetch(
    `${API_BACKEND_URL}/answers/product/${product.id}/${question}`
  ).then((response) => response.json());
}

export function addProduct(product) {
  return fetch(`${API_BACKEND_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }).then((response) => response.json());
}

export function editProduct(id, product) {
  return fetch(`${API_BACKEND_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }).then((response) => response.json());
}

export function substractOneLikeFromQuestion(ID) {
  return fetch(`${API_BACKEND_URL}/questions/dislike/${ID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      likes: -1,
    }),
  }).then((response) => response.json());
}

export function addOneLikeToQuestion(ID) {
  return fetch(`${API_BACKEND_URL}/questions/like/${ID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      likes: 1,
    }),
  }).then((response) => response.json());
}

export function deleteQuestion(ID) {
  return fetch(`${API_BACKEND_URL}/questions/${ID}`, {
    method: "DELETE",
  }).then((response) => response.json());
}

export function deleteProduct(productId) {
  return fetch(`${API_BACKEND_URL}/products/${productId}`, {
    method: "DELETE",
  });
}
