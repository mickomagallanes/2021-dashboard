import React from 'react';
import './App.css';
import Login from './Login/Login';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  state = {
    token: undefined
  };

  render() {
    if (!this.state.token) {
      return <Login setToken={(tok) => this.setState({ token: tok })} />
    }
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>
        </BrowserRouter>

      </>
    );
  }
}


export default App;
