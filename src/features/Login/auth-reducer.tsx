import {authAPI} from "../../api/todolists-api";
import {RESULT_CODE, tasksActions} from "../TodolistsList/tasks-reducer";
import {handleServerAppError, handleServerError} from "../../utils/error-utils";
import axios from "axios";
import {appAction} from "../../app/app-reduce";
// import {AppThunk} from "../../app/store";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "../TodolistsList/todolists-reducer";
import {AppThunk, AppThunkDispatch} from "../../app/store";
import {Dispatch} from "redux";
import {createAppAsyncThunk} from "../../utils/create-app-async-thunk";

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
           .addCase(meTC.fulfilled, (state,action) =>{
               state.isLoggedIn = action.payload.value
           })

        }
})


// thunks
const meTC = createAppAsyncThunk('auth/meTC', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appAction.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            return {value: true}
        }else{
            handleServerAppError(dispatch,res.data)
            return rejectWithValue(null)
        }
    }catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerError(dispatch, e)
        }
        return rejectWithValue(null)
    } finally {
        dispatch(appAction.setAppIsInitialized({isInitialized: true}))
    }

})

export const loginTC = (data: any): AppThunk => async (dispatch) => {
    dispatch(appAction.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(authActions.setIsLoggedIn({value: true}))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
    }
}
export const logOutTC = (): AppThunk => async (dispatch) => {
    dispatch(appAction.setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logOut()
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.logOut())
            dispatch(todolistsActions.logOut())
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerError(dispatch, e)
    }
}
// types
// type ActionsType = ReturnType<typeof setIsLoggedInAC> | any
export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {meTC}