import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import {AddBox} from '@mui/icons-material';
import {RequestStatusType} from "../../../app/app-reduce";

type PropsType = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
}

export const AddItemForm = React.memo(function (props: PropsType) {


    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addItem = () => {
        if (title.trim() !== '') {
            props.addItem(title)
                .then(res => {
                        setTitle('');
                    }
                )
                .catch((e) => {
                    setError(e.messages)
                })

        } else {
            setError('Title is required');
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    }

    return <div>
        <TextField variant="outlined"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
                   disabled={props.disabled}
        />
        <IconButton color="primary" onClick={addItem} disabled={props.disabled}>
            <AddBox/>
        </IconButton>
    </div>
})
