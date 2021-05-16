import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import CreateCourse from './components/CreateCourse';
import TrainerDashboard from './components/TrainerDashboard'
import Updates from './components/Updates'
import UpdateCourse from './components/UpdateCourse'
import AddTrainer from './components/AddTrainer';
import RemoveTrainer from './components/RemoveTrainer';
import Contact from './components/Contact'
import Delete from './components/Delete';
import Profile from './components/Profile';
import UpdateAccount from './components/UpdateAccount';
import Request from './components/Request';
import viewRequests from './components/viewRequests';
import trainerNotifications from './components/trainerNotifications';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path='/' exact component={Dashboard}/>
          <Route path='/signin' component={SignIn}/>
          <Route path='/signup' component={SignUp}/>
          <Route path='/create' component={CreateCourse}/>
          <Route path='/trainer' component={TrainerDashboard}/>
          <Route path='/updates' component={Updates}/>
          <Route path='/updatecourse' component={UpdateCourse}/>
          <Route path='/addtrainer' component={AddTrainer}/>
          <Route path='/removetrainer' component={RemoveTrainer}/>
          <Route path='/contact' component={Contact}/>
          <Route path='/deletecourse' component={Delete}/>
          <Route path='/profile' component={Profile}/>
          <Route path='/updateaccount' component={UpdateAccount}/>
          <Route path='/request' component={Request}/>
          <Route path='/viewrequests' component={viewRequests}/>
          <Route path='/trainernotifications' component={trainerNotifications}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
