// ошибка при регистрации с уже существующим мэйлом
class EmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = EmailError;
