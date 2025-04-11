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
import SearchPage from './page/SearchPage';
import PlaceDetailPage from './page/PlaceDetailPage';
import BookmarkPage from './page/BookmarkPage';
import AroundSearchPage from './page/AroundSearchPage';
import ChattingPage from './page/ChattingPage';
import SettingPage from './page/SettingPage';

const router = createBrowserRouter([

  { path : '/' , 
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
  {
    path : '/auth',
    element : <AuthPage/>
  },
  {
    path : '/search',
    element: (
      <ProtectedRoute>
        <SearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path : '/detail',
    element: (
      <ProtectedRoute>
        <PlaceDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path : '/bookmark',
    element: (
      <ProtectedRoute>
        <BookmarkPage />
      </ProtectedRoute>
    ),
  },
  {
    path : '/around',
    element: (
      <ProtectedRoute>
        <AroundSearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path : '/chat',
    element: (
      <ProtectedRoute>
        <ChattingPage />
      </ProtectedRoute>
    ),
  },
  {
    path : '/setting',
    element: (
      <ProtectedRoute>
        <SettingPage />
      </ProtectedRoute>
    ),
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
