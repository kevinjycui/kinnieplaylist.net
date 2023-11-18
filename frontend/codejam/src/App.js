import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './Header'
import AuthRoute from './AuthRoute'

import logo from './logo.svg';
import './App.css';

function App() {
    return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AuthRoute />}/>
        </Routes>
      </Router>
    );
}

export default App;
