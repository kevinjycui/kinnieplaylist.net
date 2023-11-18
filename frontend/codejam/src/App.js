import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './Main'

import logo from './logo.svg';
import './App.css';

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Main />}/>
        </Routes>
      </Router>
    );
}

export default App;
