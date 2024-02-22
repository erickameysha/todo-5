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
import {authThunks} from "./auth-reducer";
import {BaseResponseType} from "common/types";


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
            //
            // const errors: FormikErrorType = {}
            // if (!values.email) {
            //     errors.email = 'Required';
            // } else if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$n/i.test(values.email)) {
            //     errors.email = 'Invalid email address'
            // }
            //
            // if (!values.password) {
            //     errors.password = 'Required'
            // } else if (values.password.length < 5) {
            //     errors.password = 'Must be more five symbols'
            // }
            //
            // return errors
        },
        onSubmit:  (values, formikHelpers) => {
           dispatch(authThunks.login({data: values}))
               .unwrap()

               .catch((e: BaseResponseType)=>{
                 if (e.fieldsErrors) {
                     e.fieldsErrors.forEach(el => {
                         formikHelpers.setFieldError(el.field, el.error)
                     })
                 }
                  })
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
                           rel="noreferrer"
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
                            type="email"
                            label="Email"
                            margin="normal"
                            // error={!!(formik.touched.email && formik.errors.email)}
                            // helperText={formik.touched.email && formik.errors.email}

                            {...formik.getFieldProps('email')}
                        />
                        {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                        {/*{formik.errors.email ? <div>{formik.errors.email}</div> : null}*/}
                          <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            // error={!!(formik.touched.password && formik.errors.password)}
                            // helperText={formik.touched.password && formik.errors.password}
                            {...formik.getFieldProps('password')}
                        />
                        {formik.errors.password ? <div>{formik.errors.password}</div> : null}
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