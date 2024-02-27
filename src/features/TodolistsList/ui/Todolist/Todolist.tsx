import React, {FC, useCallback, useEffect} from 'react'

import {EditableSpan} from 'common/components/EditableSpan'
import {Task} from 'features/TodolistsList/ui/Todolist/Task/Task'
import {FilterValuesType} from 'features/TodolistsList/model/todolists-reducer'
import {tasksThunks} from 'features/TodolistsList/model/tasks-reducer'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {useAppDispatch} from "app/store";
import {RequestStatusType} from "app/app-reduce";
import {TaskStatuses} from "common/enums";
import {AddItemForm} from "common/components/AddItemForm";
import {TaskTypeEntity} from "features/TodolistsList/api/tasks.api.types";
import {useActions} from "common/hooks/useActions";

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskTypeEntity>
    changeFilter: (value: FilterValuesType, todolistId: string) => void


    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    entityStatus: RequestStatusType

}

export const Todolist: FC<PropsType> = React.memo(function (props) {
    const dispatch = useAppDispatch()
const  {addTask} = useActions(tasksThunks)
    useEffect(() => {
        // const thunk = fetchTasksTC(props.id)
        dispatch(tasksThunks.fetchTasks(props.id))
    }, [])

    const addTaskCallBack = (title: string) => {
        addTask({title, todolistId:props.id})
    }

    const removeTodolist = () => {

        props.removeTodolist(props.id)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title)
    }, [props.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.id, props.changeFilter])


    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}
                          disabled={props.entityStatus === 'loading'}/>
            <IconButton onClick={removeTodolist} disabled={props.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallBack} disabled={props.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist?.map(t => <Task
                                                key={t.id}
                                                task={t}
                                                todolistId={props.id}
                                                entityStatus = {t.entityStatus}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


