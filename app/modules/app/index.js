import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import Dashboard from './dashboard';
import TopBar from './layout/components/TopBar';
import Notification from 'containers/Notification';
import UsersPage from './user/pages/UsersPage';
import UserEditPage from './user/pages/UserEditPage';
import reducer from './redux/reducers';
import saga from './redux/saga';

import './style.scss';

class App extends Component {
  adminRoutes() {
    return (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/users" component={UsersPage} />
        <Route exact path="/users/:id" component={UserEditPage} />
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
        <TopBar />
        <Notification />
        <Container className="app-container">
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
const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

export default withRouter(compose(
  withReducer,
  withSaga,
  withConnect,
)(App));
