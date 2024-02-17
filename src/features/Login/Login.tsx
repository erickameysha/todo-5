import React, {useEffect} from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "../../app/store";

import {Navigate} from "react-router-dom";
import {appAction} from "../../app/app-reduce";
import {authSelector} from "../../app/selectors";
import {login} from "./auth-reducer";


type FormikErrorType = {
    email?: string,
    password?: string
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const {isLoggedIn} = useAppSelector(authSelector)
    // const status = useAppSelector<any>((state) => state.app.status)
    useEffect(() => {
         dispatch(appAction.setAppStatus({status:'idle'}))
    })
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {

            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required';
            } else if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$n/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }

            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 5) {
                errors.password = 'Must be more five symbols'
            }
            console.log(errors)
            return errors
        },
        onSubmit: async (values, _) => {
            _.setSubmitting(true)
            await dispatch(login({data:values}))
            console.log(values)
            // alert(JSON.stringify(values, null,2));
            _.setSubmitting(false)
            formik.resetForm()
        },
    })
    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form action="" onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            error={!!(formik.touched.email && formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            {...formik.getFieldProps('email')}
                        />
                          <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            error={!!(formik.touched.password && formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            {...formik.getFieldProps('password')}
                        />
                        <FormControlLabel
                            label={'Remember me'}
                            control={
                                <Checkbox
                                    name={'rememberMe'}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    checked={formik.values.rememberMe}
                                />
                            }
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}