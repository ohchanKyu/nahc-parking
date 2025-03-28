import './App.css'
import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainPage from './page/MainPage';
import { ToastContainer } from "react-toastify";
import LoginProvider from './store/LoginProvider';
import ProtectedRoute from './store/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContainer from './layout/AppContainer';
import AuthPage from './page/AuthPage';
const router = createBrowserRouter([

  { path : '/' , 
    element: (
      // <ProtectedRoute>
        <MainPage />
      // </ProtectedRoute>
    ),
  },
  {
    path : '/auth',
    element : <AuthPage/>
  },
]);


function App() {
  
  return (
    <>
      <LoginProvider>
        <AppContainer>
          <ToastContainer 
            toastClassName="custom-toast-container"
            bodyClassName="custom-toast-body"/>
          <RouterProvider router={router}/>
        </AppContainer>
      </LoginProvider>
    </>
  )
}

export default App
