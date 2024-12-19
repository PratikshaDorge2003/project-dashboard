import React from 'react'


import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from './components/Dashboard';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <div>
    <Provider store={store}>
      <Router>
        <Routes>
           <Route path="/" element={<Dashboard/>}/>
        </Routes>
      </Router>
    
      </Provider>
      
    </div>
  );
}

export default App;
