"use strict";
const fetch = require('node-fetch');
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJsonResponse = getJsonResponse;
exports.restGet = restGet;
exports.restPost = restPost;
exports.restDelete = restDelete;
exports.restPut = restPut;
exports.restPatch = restPatch;
var baseURL = process.env.GAME_API_BASE_URL;

async function getJsonResponse(response) {
  var json = await response.json();

  if (response.ok) {
    return json;
  } else {
    throw json;
  }
}

async function restGet(uri) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var authorizationHeaders = {};
  return fetch("".concat(baseURL).concat(uri), {
    mode: 'cors',
    headers: { ...headers,
      ...authorizationHeaders,
      'content-type': 'application/json'
    }
  }).then(getJsonResponse);
}

async function restPost(uri, body) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var authorizationHeaders = {};
  return fetch("".concat(baseURL).concat(uri), {
    method: 'POST',
    mode: 'cors',
    headers: { ...headers,
      ...authorizationHeaders,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(getJsonResponse);
}

async function restDelete(uri) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var authorizationHeaders = {};
  return fetch("".concat(baseURL).concat(uri), {
    method: 'DELETE',
    mode: 'cors',
    headers: { ...headers,
      ...authorizationHeaders,
      'content-type': 'application/json'
    }
  }).then(getJsonResponse);
}

async function restPut(uri, body) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var authorizationHeaders = {};
  return fetch("".concat(baseURL).concat(uri), {
    method: 'PUT',
    mode: 'cors',
    headers: { ...headers,
      ...authorizationHeaders,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(getJsonResponse);
}

async function restPatch(uri, body) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var authorizationHeaders = {};
  return fetch("".concat(baseURL).concat(uri), {
    method: 'PATCH',
    mode: 'cors',
    headers: { ...headers,
      ...authorizationHeaders,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(getJsonResponse);
}
