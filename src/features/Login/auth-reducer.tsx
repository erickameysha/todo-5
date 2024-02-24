import {tasksActions} from "../TodolistsList/tasks-reducer";

import axios from "axios";
import {appAction} from "../../app/app-reduce";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "../TodolistsList/todolists-reducer";


import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "../../common/utils";
import {authAPI, LoginDataType} from "./authAPI";
import {RESULT_CODE} from "../../common/enums";
import {thunkTryCatch} from "common/utils/thunkTryCatch";

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ value: boolean }>) => {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.value
            })
            .addCase(login.fulfilled, (state, action) => {

                state.isLoggedIn = action.payload.value
            })
            .addCase(logOut.fulfilled, (state,) => {

                state.isLoggedIn = false
            })
    }
})


// thunks
const initializeApp = createAppAsyncThunk<{ value: boolean }, void>('auth/meTC', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            return {value: true}
        } else {
            const isShowAppError = !res.data.fieldsErrors.length
            handleServerAppError(dispatch, res.data, isShowAppError)
            return rejectWithValue(null)
        }
    }).finally(() => {
        dispatch(appAction.setAppIsInitialized({isInitialized: true}))
    })

})

export const login = createAppAsyncThunk<{ value: boolean }, {
    data: LoginDataType
}>(`${slice.name}/login`, async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.login(arg.data)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            return {value: true}
        } else {
            const isShowAppError = !res.data.fieldsErrors.length
            handleServerAppError(dispatch, res.data, isShowAppError)
            return rejectWithValue(res.data)
        }
    })
})
export const logOut = createAppAsyncThunk(`${slice.name}/logOut`, async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.logOut()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.logOut())
            dispatch(todolistsActions.logOut())

            // dispatch(authActions.setIsLoggedIn({value: false}))
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    })
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {meTC: initializeApp, login, logOut}