import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'

// You can learn about the difference by reading this guide on minimizing bundle size.
// https://mui.com/guides/minimizing-bundle-size/
// import { AppBar, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {useAppDispatch, useAppSelector} from "./store";
import {RequestStatusType} from "./app-reduce";
import {CircularProgress, LinearProgress} from "@mui/material";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {logOutTC, meTC} from "../features/Login/auth-reducer";


function App() {

    const isInitialized = useAppSelector((state) => state.app.isInitialized)
    const status = useAppSelector<RequestStatusType>((state) => state.app.status)
    const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    const logOut = () => {
        dispatch(logOutTC())
    }
    useEffect(() => {

        dispatch(meTC())
    }, [])
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>

                    <Button onClick={logOut} color="inherit">{isLoggedIn ? 'Logout' : 'Login'}</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color={'secondary'}/>}
            <Container fixed>
                <ErrorSnackbar/>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1>404: Page not found</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                    {/*<TodolistsList/>*/}
                    {/*<Login/>*/}
                </Routes>

            </Container>
        </div>
    )
}

export default App
