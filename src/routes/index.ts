import React from "react";
import Login from "../pages/Login/Login";
import Reestr from "../pages/Reestr/Reestr";

export interface IRoute {
    path: string;
    element : React.ComponentType;
    exact?: boolean;
}

export enum RouteNames {
    LOGIN = '/login',
    REESTR = '/',
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, exact: false, element: Login}
]

export const privateRoutes: IRoute[] = [
    {path: RouteNames.REESTR, exact: true, element: Reestr}
]