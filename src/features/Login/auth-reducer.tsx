import {Dispatch} from "redux";
import {authAPI} from "../../api/todolists-api";
import {RESULT_CODE} from "../TodolistsList/tasks-reducer";
import {handleServerAppError, handleServerError} from "../../utils/error-utils";
import axios from "axios";
import {appAction} from "../../app/app-reduce";
import {AppThunk} from "../../app/store";


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
    dispatch(appAction.setAppStatus({status:'loading'}))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(setIsLoggedInAC(true))
        dispatch(appAction.setAppStatus({status:'succeeded'}))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
    } finally {
        dispatch(appAction.setAppIsInitialized({isInitialized:true}))
    }
}

export const loginTC = (data: any):AppThunk => async (dispatch) => {
    dispatch(appAction.setAppStatus({status:'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status:'succeeded'}))
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
    }
}
export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(appAction.setAppStatus({status:'loading'}))
    try {
        const res = await authAPI.logOut()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
        dispatch(appAction.setAppStatus({status:'succeeded'}))
            dispatch(setIsLoggedInAC(false))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
    }
}
// types
type ActionsType = ReturnType<typeof setIsLoggedInAC>| any
