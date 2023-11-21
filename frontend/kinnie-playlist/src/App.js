import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './elements/Header'
import AuthRoute from './AuthRoute'
import Home from './elements/Home'
import Character from './elements/Character'
import Error from './404'

import './App.css';

function App() {
    return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<AuthRoute content={<Home />} />}/>
          <Route path="/character/:character" element={<AuthRoute content={<Character />} />}/>
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    );
}

export default App;
