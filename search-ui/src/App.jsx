import './App.css';
import React from "react";
import SearchPage from './views/SearchPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './util/PrivateRoute';
import LoginComponent from './views/Login';

export class App extends React.Component {

  constructor(props) {
    super(props)
  }


  render() {
    return (
        <Router>
          <Switch>
            <Route
            path='/search/login'
            component={LoginComponent}
            />
            <PrivateRoute path='/search'
              exact={true}
              component={SearchPage}
               />
          </Switch>
        </Router>
    );
  }
}

export default App;
