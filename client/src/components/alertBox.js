import React from 'react';
import {connect} from 'react-redux';
import {authSetWarning} from '../actions/auth';

class AlertBox extends React.Component {
  
  render() {
    console.log(this.props.warning);
    return (
      <div style={{'display':(this.props.warning)?'block':'none'}}>
        <p>You are about to be logged out due to inactivity.</p>
        <button onClick={()=>this.props.dispatch(authSetWarning(false))}>Click here to remain logged in!</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    warning: state.auth.warning
  };
};
export default connect(mapStateToProps)(AlertBox);