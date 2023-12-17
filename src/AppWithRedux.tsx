import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import AddItemForm from "./AddItemForm";
import {
    addTodolistTC,
    changeFilterAC,
    changeTodolistTitleTC, FilterValuesType,
    removeTodolistTC, setTodolistTC, TodolistDomainType,
} from "./store/todolists-reducer";
import {
    addTasksTC,
    removeTasksTC, TasksStateType, updateTaskTC
} from "./store/tast-reducer";

import {useAppDispatch, useAppSelector} from "./store/store";
import {TaskStatuses, todolistAPI} from "./store/todolistApi";

export type TaskType = {
    id: string,
    title: string,
    status: TaskStatuses
}


function AppWithRedux() {
    const todolists = useAppSelector<TodolistDomainType[]>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch()
    useEffect(() => {

        todolistAPI.getTodolists()
            .then(() => {
                dispatch(setTodolistTC())
            })
    }, [])


    const removeTask = useCallback((todolistId: string, taskId: string) => {
        dispatch(removeTasksTC(todolistId, taskId))
    }, [dispatch])

    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(addTasksTC(todolistId, title))
    }, [dispatch])

    const changeStatus = useCallback((todolistId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(taskId, {status}, todolistId))

    }, [dispatch])

    const changeTaskTitle = useCallback((todolistID: string, newTitle: string, taskId: string) => {
        dispatch(updateTaskTC(taskId, {title: newTitle}, todolistID))
    }, [dispatch])
    const changeTodolistTitle = useCallback((todolistID: string, newTitle: string) => {
        dispatch(changeTodolistTitleTC(todolistID, newTitle))

    }, [dispatch])

    const changeFilter = useCallback((todolistID: string, value: FilterValuesType) => {
        dispatch(changeFilterAC(todolistID, value))

    }, [dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
        // dispatchTasks(action)
    }, [dispatch])
    const addTodolist = useCallback((title: string) => {

        dispatch(addTodolistTC(title))
        // dispatchTasks(action)

    }, [dispatch])

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
