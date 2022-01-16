const jwt = require("jsonwebtoken");
const AuthError = require("../errors/AuthError");

// функция достающая JWT из заголовка
const extractBearerToken = (header) => header.replace("Bearer ", "");

// мидлвер для верификации токена из заголовков
module.exports = (req, res, next) => {
  // достаем авторизованный заголовок
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthError("Ошибка авторизации");
  }
  // если токен есть, то извлекаем его, записывая туда только JWT
  const token = extractBearerToken(authorization);
  let payload;

  try {
    // верифицируем токен
    payload = jwt.verify(token, "some-secret-key");
  } catch (e) {
    next(new AuthError("Ошибка авторизации"));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
