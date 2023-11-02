import React, { FC } from "react";
import icons from "../../assets/icons/icons";
import Buttons from "../Buttons/Buttons";
import "./styles.scss";
import { useDispatch } from "react-redux";
import { AuthActionCreators } from "../../store/reducers/auth/action-creator";
import { useTypeSelector } from "../../hooks/useTypedSelector";

const Header: FC = () => {
  const dispatch = useDispatch();
  // const { user } = useTypeSelector((state) => state.authReducer);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  console.log(user);

  return (
    <header className="header">
      <div className="containerHeader">
        <div className="headerLogoText">
          <img src={icons.Logo} />
          <p>
            Реестр межведомственных и внутриведомственных процессов
            исполнительных и государственных органов Белгородской области
          </p>
        </div>
        <div className="userHeaderContainer">
          <div className="userName">
            <p className="lastname">{user?.lastname}</p>
            <p>{`${user?.firstname} ${user?.patronymic}`}</p>
          </div>
          <Buttons
            className="whiteButton"
            ico={icons.logOut}
            text={"Выход"}
            //@ts-ignore
            onClick={() => dispatch(AuthActionCreators.logout())}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
