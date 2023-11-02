import React, { FC, useEffect, useState } from "react";
import "./styles.scss";
import FormInput from "../FormInput/FormInput";
import Checkbox from "../Checkbox/Checkbox";
import Buttons from "../Buttons/Buttons";
import { useDispatch } from "react-redux";
import { AuthActionCreators } from "../../store/reducers/auth/action-creator";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import icons from "../../assets/icons/icons";
import ErrorMessage from "../UI/ErrorMassage/ErrorMassage";
import LoginFormAuth from "./LoginFormAuth/LoginFormAuth";
import LoginFormForgot from "./LoginFormForgot/LoginFormForgot";

const LoginForm: FC = () => {
  const dispatch = useDispatch();

  const { error, isLoading } = useTypeSelector((state) => state.authReducer);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isAuth, setIsAuth] = useState(true);

  const submit = () => {
    dispatch(AuthActionCreators.setErr(""));
    //@ts-ignore
    dispatch(AuthActionCreators.login(email, password));
  };

  useEffect(() => {
    dispatch(AuthActionCreators.setErr(""));
    dispatch(AuthActionCreators.setIsLoading(true)); // Установите isLoading в true
    const timeout = setTimeout(() => {
      dispatch(AuthActionCreators.setIsLoading(false)); // Установите isLoading в false через 2 секунды
    }, 1500);

    return () => {
      clearTimeout(timeout); // Очистите таймаут при размонтировании
    };
  }, [isAuth]);

  return (
    <div className="loginForm">
      <div
        className={`loginFormContainer ${isLoading && "active"} ${
          !isAuth && "miniContainer"
        }`}
      >
        {error != "" && (
          <ErrorMessage
            type={"error"}
            message={error}
            onClick={() => {
              submit();
            }}
            onClose={() => {
              dispatch(AuthActionCreators.setErr(""));
            }}
          />
        )}

        <div className={`containerInput ${isLoading && "active"}`}>
          {isAuth ? (
            <LoginFormAuth
              onForgot={() => {
                setIsAuth(false);
              }}
            />
          ) : (
            <LoginFormForgot
              onAuth={() => {
                setIsAuth(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
