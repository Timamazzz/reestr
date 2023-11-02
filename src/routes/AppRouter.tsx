import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RouteNames, privateRoutes, publicRoutes } from "./index";
import { useTypeSelector } from "../hooks/useTypedSelector";

const AppRouter = () => {
  const { isAuth } = useTypeSelector((state) => state.authReducer);
  const isAuthenticated = !!localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    // При изменении isAuth перенаправляем пользователя на нужный маршрут.
    if (isAuthenticated) {
      navigate("/"); // Замените '/private' на маршрут для авторизованных пользователей.
    } else {
      navigate("/login"); // Замените '/public' на маршрут для неавторизованных пользователей.
    }
  }, [isAuthenticated, isAuth, navigate]);

  return (
    <Routes>
      {privateRoutes.map((route) => (
        <Route path={route.path} element={<route.element />} key={route.path} />
      ))}
      {publicRoutes.map((route) => (
        <Route path={route.path} element={<route.element />} key={route.path} />
      ))}
    </Routes>
  );
};

export default AppRouter;
