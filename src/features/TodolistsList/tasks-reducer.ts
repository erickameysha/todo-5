import {

    TaskType, TaskTypeEntity,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {appAction, RequestStatusType} from "../../app/app-reduce";

import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistThunk} from "./todolists-reducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "../../common/utils";
import {RESULT_CODE, TaskPriorities, TaskStatuses} from "../../common/enums";
import {thunkTryCatch} from "common/utils/thunkTryCatch";


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
        logOut: () => {
            return {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistThunk.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistThunk.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistThunk.fetchTodolists.fulfilled, (state, action) => {
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

type FetchTasksType = { tasks: TaskType[], todolistId: string }
// thunks
const fetchTasks = createAppAsyncThunk<FetchTasksType, string>
('tasks/fetchTasks', async (todolistId, thunkAPI)=> {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        dispatch(appAction.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(appAction.setAppStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    })
})


export const removeTask = createAppAsyncThunk<RemoveTaskType, RemoveTaskType>
('tasks/removeTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'loading'}))
    return thunkTryCatch(thunkAPI, async () => {
        const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: 'succeeded'}))
            dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'idle'}))
            return {taskId: arg.taskId, todolistId: arg.todolistId}
        } else {
            handleServerAppError(dispatch, res.data)
            dispatch(tasksActions.setEntityStatus({taskId: arg.taskId, todolistId: arg.todolistId, status: 'idle'}))
            return rejectWithValue(null)
        }
    })

})

const addTask = createAppAsyncThunk<{ task: TaskType },
    { title: string, todolistId: string }>('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await todolistsAPI.createTask(arg.todolistId, arg.title)
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            const task = res.data.data.item
            return {task: task}
        } else {
            handleServerAppError<{
                item: TaskType
            }>(dispatch, res.data)
            return rejectWithValue(null)

        }
    })


})


const updateTask = createAppAsyncThunk<UpdateTaskType,UpdateTaskType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
        dispatch(appAction.setAppStatus({status: "loading"}));
        const state = getState();
        const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
        if (!task) {
            dispatch(appAction.setAppError({error: "Task not found in the state"}));
            return rejectWithValue(null);
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel,
        };

        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
        if (res.data.resultCode === RESULT_CODE.SUCCEDED) {
            dispatch(appAction.setAppStatus({status: "succeeded"}));
            return arg;
        } else {
            handleServerAppError(dispatch, res.data,);
            return rejectWithValue(null);
        }
    })

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


export type ErrorType = {
    message: string,
    field: string,
    code: string
}
type RemoveTaskType = {
    taskId: string,
    todolistId: string,
}
type UpdateTaskType = { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string }

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks, removeTask, addTask, updateTask}