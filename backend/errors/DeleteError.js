// ошибка, возникающая при удалении чужой карточки
class DeleteError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = DeleteError;
