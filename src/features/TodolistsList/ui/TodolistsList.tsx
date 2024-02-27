import React, {useCallback, useEffect} from 'react'
import {useAppSelector} from 'app/store'
import {
    FilterValuesType,
    todolistsActions, todolistThunk
} from 'features/TodolistsList/model/todolists-reducer'
import {tasksActions, tasksThunks} from 'features/TodolistsList/model/tasks-reducer'
import {AddItemForm} from 'common/components/AddItemForm'


import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Navigate} from "react-router-dom";
import {TaskStatuses} from "common/enums";
import {Todolist} from "features/TodolistsList/ui/Todolist";
import {useActions} from "common/hooks/useActions";
import {authSelector} from "features/auth/model/auth.selectors";
import {todoSelector} from "features/TodolistsList/model/todolist.selector";
import {taskSelector} from "features/TodolistsList/model/tasks.selector";

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
            <AddItemForm addItem={addTodolistCallBack}/>
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
                                changeFilter={changeFilter}
                                filter={tl.filter}
                                removeTodolist={removeTodolistCallBack}
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
