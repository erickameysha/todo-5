import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {AnyAction, combineReducers} from 'redux'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "./app-reduce";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore, ThunkAction, ThunkDispatch} from "@reduxjs/toolkit";
import { logger } from 'redux-logger';
import {thunk} from "redux-thunk";
    // объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
 const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
});


export const store = configureStore({
    reducer: rootReducer,
    // middleware: getDefaultMiddleware =>
    //     getDefaultMiddleware().prepend(thunk).concat(logger),
})
// непосредственно создаём store
// export const _store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния


export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>
export const useAppDispatch =  useDispatch<AppThunkDispatch>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
