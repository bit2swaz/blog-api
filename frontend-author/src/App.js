import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Blog Author Dashboard</h1>
        <p>
          Welcome to the blog author dashboard. This application will allow you to create, edit, and manage your blog posts.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built with React
        </a>
      </header>
    </div>
  );
}

export default App;
