import {tasksActions} from "features/TodolistsList/model/tasks-reducer";

import axios from "axios";
import {appAction} from "app/app-reduce";
import {createSlice, isAnyOf, isFulfilled, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "features/TodolistsList/model/todolists-reducer";


import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {authApi, LoginDataType} from "features/auth/api/auth.api";
import {RESULT_CODE} from "common/enums";
import {thunkTryCatch} from "common/utils/thunkTryCatch";
import {UnknownAsyncThunkAction} from "@reduxjs/toolkit/dist/matchers";

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            isFulfilled(authThunks.login, authThunks.logOut, authThunks.meTC),
            (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        )
    }
})


// thunks
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(`${slice.name}/meTC`, async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authApi.me()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            const isShowAppError = !res.data.fieldsErrors.length
            handleServerAppError(dispatch, res.data, isShowAppError)
            return rejectWithValue(null)
        }
    }).finally(() => {
        dispatch(appAction.setAppIsInitialized({isInitialized: true}))
    })

})

export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, {
    data: LoginDataType
}>(`${slice.name}/login`, async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authApi.login(arg.data)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: true}
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
        const res = await authApi.logOut()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.logOut())
            dispatch(todolistsActions.logOut())

           return {isLoggedIn: false}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    })
})

export const authSlice = slice.reducer
export const authActions = slice.actions
export const authThunks = {meTC: initializeApp, login, logOut}