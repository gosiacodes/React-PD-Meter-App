import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App';
import Header from "./components/header/Header";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Header />
    <App />
  </>
);



