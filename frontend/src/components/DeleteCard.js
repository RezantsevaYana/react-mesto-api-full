import React from "react";
import PopupWithForm from "./PopupWithForm.js";

function DeleteCard(props) {
  function handleSubmit(evt) {
    evt.preventDefault();

    props.onDeleteCard();
  }

  return (
    <PopupWithForm
      name="-delete"
      title="Вы уверены?"
      buttonText="Да"
      buttonTextLoading="Удаление..."
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isLoading={props.isLoading}
    />
  );
}

export default DeleteCard;