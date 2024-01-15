import {
    TaskPriorities,
    TaskStatuses,
    TaskType, TaskTypeEntity,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {AppThunkDispatch, AppRootStateType, AppThunk} from '../../app/store'
import {appAction, RequestStatusType} from "../../app/app-reduce";
import {handleServerAppError, handleServerError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "./todolists-reducer";
// import {AppDispatch} from "app/store";


const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksStateType,
    reducers: {
        // removeTask: (state, action: PayloadAction<{
        //     taskId: string;
        //     todolistId: string
        // }>) => {
        //     const tasks = state[action.payload.todolistId]
        //     const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        //     if (index !== -1) {
        //         tasks.splice(index, 1)
        //     }
        // },
        addTask: (state, action: PayloadAction<{
            task: TaskType
        }>) => {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift({...action.payload.task, entityStatus: 'idle'})
        },
        updateTask: (
            state,
            action: PayloadAction<{
                taskId: string
                model: UpdateDomainTaskModelType
                todolistId: string
            }>,
        ) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        // setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) => {
        //     state[action.payload.todolistId] = action.payload.tasks.map(el => ({...el, entityStatus: 'idle'}))
        // },
        setEntityStatus: (state, action: PayloadAction<{
            taskId: string,
            todolistId: string,
            status: RequestStatusType
        }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index].entityStatus = action.payload.status
            }
        },
        logOut: (state) => {
            return {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl: any) => {
                    state[tl.id] = []
                })
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map(el => ({...el, entityStatus: 'idle'}))

            })
            .addCase(removeTask.fulfilled,(state,action)=>{
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                if (index !== -1) {
                    tasks.splice(index, 1)
                }
            })
    },
})


// thunks
// export const _fetchTasksTC = (todolistId: string): AppThunk => async (dispatch) => {
//     // dispatch(appAction.setAppStatus({status: 'loading'}))
//     try {
//         const res = await todolistsAPI.getTasks(todolistId)
//         console.log(res)
//         dispatch(tasksActions.setTasks({tasks: res.data.items, todolistId: todolistId}))
//         dispatch(appAction.setAppStatus({status: 'succeeded'}))
//     } catch (e) {
//         if (axios.isAxiosError<ErrorType>(e)) {
//             handleServerError(dispatch, e)
//         }
//     }
//
// }

const fetchTasks = createAsyncThunk<
    // 1. То, что возвращает Thunk
    {
        tasks: TaskType[],
        todolistId: string
    },
    // 2. ThunkArg - аргументы санки (тип, который санка принимает)
    string,
    // 3. AsyncThunkConfig. Какие есть поля смотрим в доке.
    // rejectValue - Используем для типизации возвращаемой ошибки
    // state - используем для типизации App. Когда используем getState
    {
        rejectValue: unknown,
        store: AppRootStateType,
        dispatch: AppThunkDispatch
    }>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI

    try {
        dispatch(appAction.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(appAction.setAppStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})


export const removeTask = createAsyncThunk<
    {taskId: string,
        todolistId: string, }, {
    taskId: string,
    todolistId: string,
}, {rejectWithValue:unknown,state:AppRootStateType,dispatch:AppThunkDispatch}>

('tasks/removeTask', async (arg, thunkAPI) => {
    const {dispatch,rejectWithValue} = thunkAPI
    dispatch(appAction.setAppStatus({status: 'loading'}))
    dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {

            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.setEntityStatus({taskId:arg.taskId, todolistId:arg.todolistId, status: 'idle'}))
            // const action = tasksActions.removeTask(
             return    {taskId:arg.taskId,todolistId: arg.todolistId}
            // dispatch(action)
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(tasksActions.setEntityStatus({taskId:arg.taskId, todolistId:arg.todolistId, status: 'idle'}))
            return rejectWithValue(null)
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            handleServerError(dispatch, e)
            dispatch(tasksActions.setEntityStatus({taskId:arg.taskId, todolistId:arg.todolistId, status: 'idle'}))
            return rejectWithValue(null)
        }
    }
})
export const addTaskTC = (title: string, todolistId: string) => async (dispatch) => {

    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            const task = res.data.data.item
            const action = tasksActions.addTask({task: task})
            dispatch(action)
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError<{
                item: TaskType
            }>(dispatch, res.data)

        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e))
            handleServerError(dispatch, e)
    }


}

export enum RESULT_CODE {
    SUCCEDED = 0,
    FAILED = 1,
    RECAPTCHA_FAILED = 10
}

export type ErrorType = {
    message: string,
    field: string,
    code: string
}
// export const addTaskTC = (title: string, todolistId: string) => async (dispatch) => {
//
//     try {
//         const res = await todolistsAPI.createTask(todolistId, title)
//         if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
//             const task = res.data.data.item
//             const action = tasksActions.addTask({task: task})
//             dispatch(action)
//             dispatch(appAction.setAppStatus({status: 'succeeded'}))
//         } else {
//             handleServerAppError<{
//                 item: TaskType
//             }>(dispatch, res.data)
//
//         }
//     } catch (e) {
//         if (axios.isAxiosError<ErrorType>(e))
//             handleServerError(dispatch, e)
//     }
//
//
// }
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    async (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        dispatch(appAction.setAppStatus({status: 'loading'}))
        dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'loading'}))
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
        try {
            const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
            if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
                const action = tasksActions.updateTask({taskId, model: domainModel, todolistId})
                dispatch(action)
                dispatch(appAction.setAppStatus({status: 'succeeded'}))
                dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'idle'}))
            } else {
                if (res.data.messages.length) {
                    dispatch(appAction.setAppError({error: res.data.messages[0]}))
                    dispatch(tasksActions.setEntityStatus({taskId, todolistId, status: 'idle'}))
                } else {
                    dispatch(appAction.setAppError({error: 'Some error'}))
                }

            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                handleServerError(dispatch, e)
            } else {
                const error = (e as {
                    message: string
                })
                handleServerError(dispatch, error)
            }
        }

    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskTypeEntity>
}
export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks,removeTask}