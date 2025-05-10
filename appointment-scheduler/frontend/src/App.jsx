import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';

const App = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/appointments/new" component={AppointmentForm} />
                    <Route path="/appointments" component={AppointmentList} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;