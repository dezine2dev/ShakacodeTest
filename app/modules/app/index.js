import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { createStructuredSelector } from 'reselect';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import Dashboard from './dashboard';

import './style.scss';

class App extends Component {
  adminRoutes() {
    return (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    );
  }

  userRoutes() {
    return (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    );
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div className="main-app">
        <Container className="app-container">
          {currentUser.get('role')}
          {this[`${currentUser.get('role')}Routes`]()}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps);

export default withRouter(compose(
  withConnect,
)(App));
