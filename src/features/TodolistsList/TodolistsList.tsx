import React, {useCallback, useEffect} from 'react'
import {useAppDispatch, useAppSelector} from '../../app/store'
import {
    FilterValuesType,
    todolistsActions, todolistThunk
} from './todolists-reducer'
import {tasksActions, tasksThunks} from './tasks-reducer'
import {AddItemForm} from '../../common/components/AddItemForm'


import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Navigate} from "react-router-dom";
import {authSelector, taskSelector, todoSelector} from "../../app/selectors";
import {TaskStatuses} from "common/enums";
import {Todolist} from "./Todolist";
import {useActions} from "common/hooks/useActions";

export const TodolistsList: React.FC = () => {

    const todolists = useAppSelector(todoSelector)
    const tasks = useAppSelector(taskSelector)
    const {isLoggedIn} = useAppSelector(authSelector)

    const {fetchTodolists,removeTodolist,changeTodolistTitle,addTodolist} = useActions(todolistThunk)
    const {removeTask, addTask, updateTask, fetchTasks} = useActions(tasksThunks)
    const {changeTodolistFilter} = useActions(todolistsActions)

    useEffect(() => {
        if (!isLoggedIn) return
        fetchTodolists()

    }, [])

    const removeTaskCallBack = useCallback(function (id: string, todolistId: string) {
        removeTask({taskId: id, todolistId: todolistId})
    }, [])

    const addTaskCallback = useCallback(function (title: string, todolistId: string) {
        // const thunk = tasksThunks.addTask(title, todolistId)
        addTask({title, todolistId})
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        // const thunk =
        updateTask({taskId: id, domainModel: {status}, todolistId})
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        updateTask({taskId: id, domainModel: {title: newTitle}, todolistId})

    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        changeTodolistFilter({id: todolistId, filter: value})

    }, [])

    const removeTodolistCallBack = useCallback(function (id: string) {

      removeTodolist({todolistId: id})
    }, [])

    const changeTodolistTitleCallBack = useCallback(function (id: string, title: string) {
        changeTodolistTitle({id, title})

    }, [])

    const addTodolistCallBack = useCallback((title: string) => {
   addTodolist(title)
    }, [])
    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist

                                id={tl.id}
                                title={tl.title}
                                tasks={allTodolistTasks}
                                removeTask={removeTaskCallBack}
                                changeFilter={changeFilter}
                                addTask={addTaskCallback}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolist={removeTodolistCallBack}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitleCallBack}
                                entityStatus={tl.entityStatus}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
