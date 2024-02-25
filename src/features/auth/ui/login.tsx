import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Navigate} from "react-router-dom";
import {useLogin} from "features/auth/lib/useLogin";



export type LoginParamsType = {
    email: string,
    password: string
    rememberMe: boolean
    captcha?: string
}

export const Login = () => {
    const {formik,isLoggedIn}= useLogin()

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