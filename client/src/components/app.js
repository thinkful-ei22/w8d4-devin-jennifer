import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import AlertBox from './alertBox';
import RegistrationPage from './registration-page';
import {refreshAuthToken, clearAuth, authSetWarning} from '../actions/auth';

export class App extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.loggedIn && this.props.loggedIn) {
      // When we are logged in, refresh the auth token periodically
      this.startPeriodicRefresh();
    } else if (prevProps.loggedIn && !this.props.loggedIn) {
      // Stop refreshing when we log out
      this.stopPeriodicRefresh();
    }
    if(this.props.loggedIn && !this.alertIdleTimer){
      this.refreshActivity();
    }
  }

  componentWillUnmount() {
    this.stopPeriodicRefresh();
  }

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(
      () => this.props.dispatch(refreshAuthToken()),
      10 * 60 * 1000 // 10 min
    );
  }

  stopPeriodicRefresh() {
    if (!this.refreshInterval) {
      return;
    }

    clearInterval(this.refreshInterval);
  }
  
  refreshActivity(){
    if(this.alertIdleTimer) window.clearTimeout(this.alertIdleTimer);
    if(this.props.loggedIn){
      this.alertIdleTimer = setTimeout(
        () => this.props.dispatch(authSetWarning(true)),
        5 * 1000
      );
    }
    
    if(this.activityTimer) window.clearTimeout(this.activityTimer);
    this.activityTimer = setTimeout(
      () => this.props.dispatch(clearAuth()),
      10 * 1000);
  }


  render() {
    return (
      <div className="app" onClick={()=>{
        this.refreshActivity();
      }}>
        <HeaderBar />
        <AlertBox />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/register" component={RegistrationPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // activity: state.auth.activity,
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
