import React, {ChangeEvent, FC} from 'react'
import {EditableSpan} from 'common/components/EditableSpan'

import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {RequestStatusType} from "app/app-reduce";
import {TaskStatuses} from "common/enums";
import {TaskType} from "features/TodolistsList/api/tasks.api.types";
import {useActions} from "common/hooks/useActions";
import {tasksThunks} from "features/TodolistsList/model/tasks-reducer";

type TaskProps = {
    task: TaskType
    todolistId: string
    entityStatus: RequestStatusType

}
export const Task: FC<TaskProps> = React.memo(({task, todolistId, entityStatus}) => {

    const {removeTask, updateTask} = useActions(tasksThunks)
    const removeTaskHandler = () => removeTask({taskId: task.id, todolistId: todolistId});
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        updateTask({
            taskId: task.id,
            domainModel: {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New},
            todolistId: todolistId
        })
    }
    const onTitleChangeHandler = (newValue: string) => {
        updateTask({taskId: task.id, domainModel: {title: newValue}, todolistId: todolistId})
    }

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
            disabled={entityStatus === 'loading'}
        />

        <EditableSpan disabled={entityStatus === 'loading'} value={task.title} onChange={onTitleChangeHandler}/>
        <IconButton disabled={entityStatus === 'loading'} onClick={removeTaskHandler}>
            <Delete/>
        </IconButton>
    </div>
})
