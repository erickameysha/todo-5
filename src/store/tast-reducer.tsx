
import {v1} from "uuid";
import {AddTodolistACType, removeTodolistACType, setTodolistACType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI} from "./todolistApi";
import {Dispatch} from "redux";
export type  ActionType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof getTasksAC>
    | AddTodolistACType
    | removeTodolistACType
    |setTodolistACType

const initialState : TasksStateType = {}
export const tasksReducer = (state= initialState, action: ActionType) => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistID]: state[action.todolistID]
                    .filter(t => t.id !== action.taskId)
            }
        }
        case "GET-TASK":{
            return {
                ...state,
                [action.id]: action.tasks
            }        }
        case "ADD-TASK":{
            let task = {id: v1(), title: action.newTitle, isDone: false};
            // let newTodo: TodolistsType = {id: newId, title: action.newTitle, filter: 'all'}
            return {...state, [action.todolistID]:[task,... state[action.todolistID]]

                  }
        }
        case "UPDATE-TASK":{
            return {...state, [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {...el,...action.model} : el)}
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
        case "SET-TODOLIST":{
            const copyState ={...state}
           action.payload.todolists.forEach((tl)=> {
               copyState[tl.id] = []
           })
            return copyState
        }
        default:
            return state
    }
}


//
// export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
//     (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
//         const state = getState()
//         const task = state.tasks[todolistId].find(t => t.id === taskId)
//         if (!task) {
//             //throw new Error("task not found in the state");
//             console.warn('task not found in the state')
//             return
//         }
//
//         const apiModel: UpdateTaskModelType = {
//             deadline: task.deadline,
//             description: task.description,
//             priority: task.priority,
//             startDate: task.startDate,
//             title: task.title,
//             status: task.status,
//             ...domainModel
//         }
//
//         todolistsAPI.updateTask(todolistId, taskId, apiModel)
//             .then(res => {
//                 const action = updateTaskAC(taskId, domainModel, todolistId)
//                 dispatch(action)
//             })
//     }

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const removeTaskAC = (taskId: string, todolistID: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistID} as const
}
export const addTaskAC = (newTitle: string, todolistID: string) => {
    return {type: 'ADD-TASK', newTitle, todolistID} as const
}
export const getTasksAC = (id:string,tasks: TaskType[]) => {
    return {type: 'GET-TASK', id, tasks} as const
}
export const getTasksTC = (todolistID:string) =>(dispatch: Dispatch)=> {
    todolistAPI.getTasks(todolistID)
      .then((res)=> dispatch(getTasksAC(todolistID,res.data.items)))
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