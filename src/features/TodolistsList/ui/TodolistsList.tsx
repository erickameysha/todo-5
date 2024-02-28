import React, {useCallback, useEffect} from 'react'
import {useAppSelector} from 'app/store'
import {todolistThunk} from 'features/TodolistsList/model/todolists-reducer'
import {AddItemForm} from 'common/components/AddItemForm'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Navigate} from "react-router-dom";
import {Todolist} from "features/TodolistsList/ui/Todolist";
import {useActions} from "common/hooks/useActions";
import {authSelector} from "features/auth/model/auth.selectors";
import {todoSelector} from "features/TodolistsList/model/todolist.selector";
import {taskSelector} from "features/TodolistsList/model/tasks.selector";

export const TodolistsList: React.FC = () => {

    const todolists = useAppSelector(todoSelector)
    const tasks = useAppSelector(taskSelector)
    const {isLoggedIn} = useAppSelector(authSelector)

    const {fetchTodolists, addTodolist} = useActions(todolistThunk)


    useEffect(() => {
        if (!isLoggedIn) return
        fetchTodolists()

    }, [])

    const addTodolistCallBack = useCallback((title: string) => {
        return addTodolist(title).unwrap()
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
                                todolist={tl}
                                tasks={allTodolistTasks}

                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
