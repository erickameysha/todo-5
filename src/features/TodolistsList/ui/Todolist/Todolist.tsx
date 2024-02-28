import React, {FC, useCallback, useEffect} from 'react'

import {EditableSpan} from 'common/components/EditableSpan'
import {Task} from 'features/TodolistsList/ui/Todolist/Task/Task'
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
    todolistThunk
} from 'features/TodolistsList/model/todolists-reducer'
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
    todolist: TodolistDomainType
    tasks: Array<TaskTypeEntity>
}

export const Todolist: FC<PropsType> = React.memo(function (props) {
    const dispatch = useAppDispatch()
    const {addTask} = useActions(tasksThunks)
    useEffect(() => {
        dispatch(tasksThunks.fetchTasks(props.todolist.id))
    }, [])

    const addTaskCallBack = (title: string) => {
        return addTask({title, todolistId: props.todolist.id}).unwrap()
    }
    const {removeTodolist, changeTodolistTitle,changeTodolistFilter} = useActions({...todolistThunk,...todolistsActions} )
    const changeFilter = function (value: FilterValuesType, todolistId: string) {
        changeTodolistFilter({id: todolistId, filter: value})

    }
    const removeTodolistCallBack = () => {

        removeTodolist({todolistId: props.todolist.id})
    }
    const changeTodolistTitleCallBack = (title: string) => {
     changeTodolistTitle({id:props.todolist.id, title})
    }

    const onAllClickHandler = () => changeFilter('all', props.todolist.id)
    const onActiveClickHandler = () => changeFilter('active', props.todolist.id)
    const onCompletedClickHandler = () => changeFilter('completed', props.todolist.id)


    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallBack}
                          disabled={props.todolist.entityStatus === 'loading'}/>
            <IconButton onClick={removeTodolistCallBack} disabled={props.todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallBack} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist?.map(t => <Task
                    key={t.id}
                    task={t}
                    todolistId={props.todolist.id}
                    entityStatus={t.entityStatus}
                />)
            }
        </div>
        <React.Fragment  /*style={{paddingTop: '10px'}}*/>

            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>

        </React.Fragment>
    </div>
})


