import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <div className="header__logo"></div>
      <div className="header__info">
        <div className="header__email">{props.mail}</div>
        <Link onClick={props.onClick} to={props.to} className={`${props.isLoggedIn ? "header__title-main" : "header__title"}`}>
          {props.title}
        </Link>
      </div>
    </header>
  );
}

export default Header;

