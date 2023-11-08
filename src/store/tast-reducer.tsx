import {TaskStateType, TodolistsType} from "../App";
import {v1} from "uuid";
import {AddTodolistACType, removeTodolistACType} from "./todolists-reducer";

type  ActionType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | AddTodolistACType
    | removeTodolistACType
export const tasksReducer = (state: TaskStateType, action: ActionType) => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID]
                    .filter(t => t.id !== action.taskId)
            }
        }
        case "ADD-TASK":{

            const newId = v1()
            let task = {id: v1(), title: action.newTitle, isDone: false};
            // let newTodo: TodolistsType = {id: newId, title: action.newTitle, filter: 'all'}
            return {...state, [action.todolistID]:[task,... state[action.todolistID]]

                  }
        }
        case "CHANGE-TASK-STATUS":{
            return {...state, [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {...el, isDone:action.isDone} : el)}
        }
        case "CHANGE-TASK-TITLE":{
            return {...state, [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {...el, title:action.title} : el)}

        }
        case "ADD-TODOLIST":{
            return {
                ...state,
                [action.payload.id]:[]
            }
        }
        case "REMOVE-TODOLIST":{
            delete state[action.payload.id]
            return {
                ...state
            }
        }
        default:
            return state
    }
}
export const removeTaskAC = (taskId: string, todolistID: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistID} as const
}
export const addTaskAC = (newTitle: string, todolistID: string) => {
    return {type: 'ADD-TASK', newTitle, todolistID} as const
}
export const changeTaskStatusAC = (todolistId: string, taskId: string, isDone: boolean) => {
    return {type: 'CHANGE-TASK-STATUS', todolistId, taskId, isDone} as const
}
export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) => {
    return {type: 'CHANGE-TASK-TITLE', todolistId, taskId, title} as const
}