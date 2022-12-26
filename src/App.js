import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Todos from './pages/Todos';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Todos />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  );
}

export default App;
