import { AppDispatch } from "../../index";
import { IUser } from "../../../models/IUser";
import { AuthActionEnum, SetAuthAction, SetErrorAction, SetIsLoadingAction, SetTokenAction, SetUserAction } from "./types";
import { IToken } from "../../../models/IToken";
import TokenApiRequest from "../../../api/User/Token";
import jwt from 'jwt-decode';
import UserApiRequest from "../../../api/User/Users";

export const AuthActionCreators = {
    setUser: (user: IUser): SetUserAction => ({ type: AuthActionEnum.SET_USER, payload: user }),
    setToken: (token: IToken): SetTokenAction => ({ type: AuthActionEnum.SET_TOKEN, payload: token }),
    setIsAuth: (auth: boolean): SetAuthAction => ({ type: AuthActionEnum.SET_AUTH, payload: auth }),
    setErr: (payload: string): SetErrorAction => ({ type: AuthActionEnum.SET_ERROR, payload }),
    setIsLoading: (payload: boolean): SetIsLoadingAction => ({ type: AuthActionEnum.SET_IS_LOADING, payload }),
    login: (email: string, password: string) => async (dispatch: AppDispatch) => {
        dispatch(AuthActionCreators.setIsLoading(true));
        const mockUser = { email, password };
        const userToken = new TokenApiRequest();
        const userData = new UserApiRequest();
        setTimeout(()=>{
            if (mockUser.email.length === 0 || mockUser.password.length === 0) {
                dispatch(AuthActionCreators.setErr('Некорректный логин или пароль'));
                dispatch(AuthActionCreators.setIsLoading(false));
                return;
            }
            try {
                userToken.create({ body: mockUser }).then((resp)=>{
                    if (resp.success) {
                        const tokens = resp.data as IToken;
                        dispatch(AuthActionCreators.setToken(tokens));
                        localStorage.setItem('access', tokens.access || '')
                        localStorage.setItem('refresh', tokens.refresh || '')
                        //@ts-ignore
                        const decodeJwt = jwt(tokens.refresh) || '';
                    console.log('localStorage.getItem', localStorage.getItem('access'));
                    
                       if(localStorage.getItem('access')){
                           //@ts-ignore
                            userData.getById({id: decodeJwt.user_id + '/'}).then((resp)=>{
                                    
                                if(resp.success){
                                    localStorage.setItem('auth', "true");
                                    localStorage.setItem('email', mockUser.email);
                            
                                    if (resp.data) {
                                        const data: { email?: string, first_name?: string, last_name?: string, patronymic?: string } = resp.data;
                                    
                                        const user = {
                                        email: data.email,
                                        firstname: data.first_name,
                                        lastname: data.last_name,
                                        patronymic: data.patronymic
                                        };
                                    
                                        localStorage.setItem('user', JSON.stringify(user));
                                        dispatch(AuthActionCreators.setIsAuth(true));
                                    }
                                    
                                    
                                    //@ts-ignore
                                    dispatch(AuthActionCreators.setUser({email: resp.data.email, password: mockUser.password, firstname: resp.data.first_name, lastname: resp.data.last_name, patronymic: resp.data.patronymic}));
                                
                                } else {
                                    dispatch(AuthActionCreators.setErr('Ошибка получения пользователя'));
                                }
                            })
                       }
                          
                        
                      
                    } else {
                        console.log(resp);
                        dispatch(AuthActionCreators.setErr('Произошла ошибка авторизации'));
                    }
                });
               
            } catch (e) {
                dispatch(AuthActionCreators.setErr('Произошла ошибка при авторизации'));
            }
            dispatch(AuthActionCreators.setIsLoading(false));
        }, 2500)
      
    },
    logout: () => async (dispatch: AppDispatch) => {
        dispatch(AuthActionCreators.setIsLoading(true));
        localStorage.removeItem('auth');
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        dispatch(AuthActionCreators.setIsAuth(false));
        dispatch(AuthActionCreators.setUser({} as IUser));
        dispatch(AuthActionCreators.setIsLoading(false));
    }
}
