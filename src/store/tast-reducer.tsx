import {AddTodolistACType, removeTodolistACType, setTodolistACType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "./todolistApi";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type  ActionType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof getTasksAC>
    | AddTodolistACType
    | removeTodolistACType
    | setTodolistACType

const initialState: TasksStateType = {}
export const tasksReducer = (state = initialState, action: ActionType) => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID]
                    .filter(t => t.id !== action.taskId)
            }
        }
        case "GET-TASK": {
            return {
                ...state,
                [action.id]: action.tasks
            }
        }
        case "ADD-TASK": {

            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]

            }
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.todolistId]:
                    state[action.todolistId].map(el => el.id === action.taskId ?
                        {...el, ...action.model} : el)
            }
        }

        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.payload.task.id]: []
            }
        }
        case "REMOVE-TODOLIST": {
            delete state[action.payload.id]
            return {
                ...state
            }
        }
        case "SET-TODOLIST": {
            const copyState = {...state}
            action.payload.todolists.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        default:
            return state
    }
}



export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const removeTaskAC = (taskId: string, todolistID: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistID} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const getTasksAC = (id: string, tasks: TaskType[]) => {
    return {type: 'GET-TASK', id, tasks} as const
}
export const getTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
    todolistAPI.getTasks(todolistID)
        .then((res) => dispatch(getTasksAC(todolistID, res.data.items)))
}
export const removeTasksTC = (todolistID: string, taskID: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(todolistID, taskID)
        .then(() => dispatch(removeTaskAC( taskID,todolistID)))
}
export const addTasksTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTask(todolistID, title)
        .then((res) => dispatch(addTaskAC(res.data.data.item)))
}


export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
        const state = getState().tasks[todolistId]
        const task = state.find(t => t.id === taskId)
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

        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then(() => {
                const action = updateTaskAC(taskId, domainModel, todolistId)
                dispatch(action)
            })
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
    [key: string]: Array<TaskType>
}