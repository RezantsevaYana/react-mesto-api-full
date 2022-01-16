import React from "react";
import PopupWithForm from "./PopupWithForm.js";

function AddPlacePopup(props) {
  // стейты в которых содержаться значения инпутов
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  // очищение полей добавления карточек при новом открытии попапа

  React.useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen]);

  // обработчики изменения инпутов

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleLinkChange(evt) {
    setLink(evt.target.value);
  }

  // функция с помощью которой происходит добавление кароточки

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onAddPlace({ name, link });
  }

  return (
    <PopupWithForm
      name="_js_item"
      title="Новое место"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isLoading={props.isLoading}
      buttonText="Создать"
      buttonTextLoading="Создание..."
    >
      <input
        id="title-input"
        type="text"
        className="popup__input popup__input_info_title"
        name="name"
        placeholder="Название"
        value={name || ""}
        onChange={handleNameChange}
      />
      <span className="error title-input-error"></span>
      <input
        id="email-input"
        type="url"
        className="popup__input popup__input_info_link"
        name="link"
        placeholder="Ссылка на картинку"
        value={link || ""}
        onChange={handleLinkChange}
      />
      <span className="error email-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;