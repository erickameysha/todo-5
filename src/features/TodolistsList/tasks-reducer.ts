import {
    TaskPriorities,
    TaskStatuses,
    TaskType, TaskTypeEntity,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {AppRootStateType, AppThunkDispatch} from '../../app/store'
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
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                if (index !== -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(
                addTask.fulfilled, (state, action) => {
                    const tasks = state[action.payload.task.todoListId]
                    tasks.unshift({...action.payload.task, entityStatus: 'idle'})
                }
            )
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
    },
})


// thunks
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
    {
        taskId: string,
        todolistId: string,
    }, {
    taskId: string,
    todolistId: string,
}, { rejectWithValue: unknown, state: AppRootStateType, dispatch: AppThunkDispatch }>

('tasks/removeTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appAction.setAppStatus({status: 'loading'}))
    dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'loading'}))
    try {
        const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {

            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'idle'}))
            // const action = tasksActions.removeTask(
            return {taskId: arg.taskId, todolistId: arg.todolistId}
            // dispatch(action)
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'idle'}))
            return rejectWithValue(null)
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            handleServerError(dispatch, e)
            dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'idle'}))
        }
        return rejectWithValue(null)
    }
})

const addTask = createAsyncThunk<{ task: TaskType },
    { title: string, todolistId: string },
    { rejectWithValue: unknown, state: AppRootStateType, dispatch: AppThunkDispatch }>('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        const res = await todolistsAPI.createTask(arg.todolistId, arg.title)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            const task = res.data.data.item
            // dispatch(action)
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            return {task: task}
        } else {
            handleServerAppError<{
                item: TaskType
            }>(dispatch, res.data)
            return rejectWithValue(null)

        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e))
            handleServerError(dispatch, e)
        return rejectWithValue(null)
    }
})

const updateTask = createAsyncThunk<
    { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string },
    { taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType },
    { rejectWithValue: unknown, state: AppRootStateType, dispatch: AppThunkDispatch }>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, getState, rejectWithValue} = thunkAPI
    const state = getState()
    const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)

    dispatch(appAction.setAppStatus({status: 'loading'}))
    dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'loading'}))
    if (!task) {
        //throw new Error("task not found in the state");
        console.warn('task not found in the state')
        return rejectWithValue(null)
    }

    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel
    }
    try {
        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            // const action = tasksActions.updateTask({taskId:arg.taskId, model: arg.domainModel, todolistId:arg.todolistId})
            // dispatch(action)
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            return arg
        } else {
            if (res.data.messages.length) {
                dispatch(appAction.setAppError({error: res.data.messages[0]}))
                dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'idle'}))
                return rejectWithValue(null)
            } else {
                dispatch(appAction.setAppError({error: 'Some error'}))
                return rejectWithValue(null)
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
        return rejectWithValue(null)
    }

})

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

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks, removeTask, addTask, updateTask}