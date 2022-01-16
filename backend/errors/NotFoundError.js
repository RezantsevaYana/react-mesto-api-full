// ошибка, возникающая, когда не найден ресурс по переданному id
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
