import {tasksReducer} from 'features/TodolistsList/model/tasks-reducer';
import {todolistsReducer} from 'features/TodolistsList/model/todolists-reducer';
import {AnyAction, combineReducers} from 'redux'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "./app-reduce";
import {authSlice} from "features/auth/model/auth.slice";
import {configureStore, ThunkAction, ThunkDispatch} from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        todolists: todolistsReducer,
        app: appReducer,
        auth: authSlice
    },

})

export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;
export const useAppDispatch =  useDispatch<AppThunkDispatch>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
