import {Dispatch} from "redux";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reduce";
import {authAPI} from "../../api/todolists-api";
import {RESULT_CODE} from "../TodolistsList/tasks-reducer";
import {handleServerAppError, handleServerError} from "../../utils/error-utils";
import axios from "axios";


const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(setIsLoggedInAC(true))
            setAppStatusAC('succeeded')
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
    }
}

export const loginTC = (data: any) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            setAppStatusAC('succeeded')
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
    }
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType