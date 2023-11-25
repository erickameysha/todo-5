import React, {Reducer, useCallback, useMemo, useReducer} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import AddItemForm from "./AddItemForm";
import {
    ActionType, addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./store/todolists-reducer";
import {
    ActionTaskType,
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer
} from "./store/tast-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistsType = {
    id: string,
    title: string,
    filter: FilterValuesType
}
export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

export type TaskStateType = {
    [todlistId: string]: TaskType[]
}

function AppWithRedux() {
  
    const todolists = useSelector<AppRootStateType, TodolistsType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const dispatch = useDispatch()

    const removeTask=useCallback((todolistId: string, taskId: string) => {
        const action = removeTaskAC(taskId, todolistId)
        dispatch(action)
    },[dispatch])

    const addTask=useCallback((todolistId: string, title: string)=> {

        dispatch(addTaskAC(title, todolistId))
    },[dispatch])

    const changeStatus=useCallback((todolistId: string, taskId: string, isDone: boolean)=> {
        dispatch(changeTaskStatusAC(todolistId, taskId, isDone))

    },[dispatch])

    const changeTaskTitle = useCallback((todolistID: string, newTitle: string, taskId: string) => {
        dispatch(changeTaskTitleAC(todolistID, taskId, newTitle))
    },[dispatch])
    const changeTodolistTitle = useCallback((todolistID: string, newTitle: string) => {
        dispatch(changeTodolistTitleAC(todolistID, newTitle))

    },[dispatch])

    const changeFilter=useCallback((todolistID: string, value: FilterValuesType)=> {
        dispatch(changeFilterAC(todolistID, value))

    },[dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        const action = removeTodolistAC(todolistId)
        dispatch(action)
        // dispatchTasks(action)
    },[dispatch])
    const addTodolist = useCallback((title: string) => {
        const action = addTodolistAC(title)
        dispatch(action)
        // dispatchTasks(action)

    },[dispatch])

    return (
        <div className="App">
            <div>
                <AddItemForm callback={addTodolist}/>
            </div>
            {todolists.map(el => {


                return <Todolist
                    todolistID={el.id}
                    key={el.id}
                    title={el.title}
                    tasks={tasks[el.id]}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    removeTodolist={removeTodolist}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodolistTitle}
                    filter={el.filter}
                />
            })}

        </div>
    );
}

export default AppWithRedux;
