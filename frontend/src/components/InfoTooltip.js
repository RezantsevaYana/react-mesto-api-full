import React from "react";

function InfoTooLtip(props) {
  return (
    <section
      className={`popup popup-info ${props.isOpen ? "popup_opened" : ""}`}
    >
      <div className="popup__container popup__container-info">
        <button
          className="popup__close"
          type="button"
          onClick={props.onClose}
        ></button>
        <img
          src={props.image}
          className="popup-info__logo"
          alt="Информация о результате выполнения операции"
        />
        <h2 className="popup-info__title">{props.title}</h2>
      </div>
    </section>
  );
}

export default InfoTooLtip;