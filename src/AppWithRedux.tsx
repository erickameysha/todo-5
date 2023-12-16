import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import AddItemForm from "./AddItemForm";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, TodolistDomainType,
} from "./store/todolists-reducer";
import {
    addTaskAC,
    removeTaskAC, TasksStateType, updateTaskAC
} from "./store/tast-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store/store";
import {TaskStatuses, todolistAPI} from "./store/todolistApi";

export type TaskType = {
    id: string,
    title: string,
    status: TaskStatuses
}


function AppWithRedux() {
    const todolists = useSelector<AppRootStateType, TodolistDomainType[]>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    useEffect(()=>{

        todolistAPI.getTodolists()
            .then((res)=> {
                console.log(res.data)
            })
    })
    const dispatch = useDispatch()

    const removeTask=useCallback((todolistId: string, taskId: string) => {
        const action = removeTaskAC(taskId, todolistId)
        dispatch(action)
    },[dispatch])

    const addTask=useCallback((todolistId: string, title: string)=> {

        dispatch(addTaskAC(title, todolistId))
    },[dispatch])

    const changeStatus=useCallback((todolistId: string, taskId: string, status: TaskStatuses)=> {
        dispatch(updateTaskAC(taskId,{status} ,todolistId))

    },[dispatch])

    const changeTaskTitle = useCallback((todolistID: string, newTitle: string, taskId: string) => {
        dispatch(updateTaskAC( taskId,{title: newTitle},todolistID))
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
