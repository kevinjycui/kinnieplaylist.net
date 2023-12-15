import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import Home from './elements/home/Home';
import Character from './elements/character/Character';
import Latest from './elements/latest/Latest';
import Random from './elements/random/Random';
import Profile from './elements/profile/Profile';
import Error from './404';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute content={<Home />} />} />
        <Route path="/character/:character" element={<AuthRoute content={<Character />} />} />
        <Route path="/latest" element={<AuthRoute content={<Latest />} />} />
        <Route path="/random" element={<AuthRoute content={<Random />} />} />
        <Route path="/profile" element={<AuthRoute content={<Profile />} />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <div className="legal">©Copyright {new Date().getFullYear()} Kinnie Playlist</div>
    </Router>
  );
}

export default App;
