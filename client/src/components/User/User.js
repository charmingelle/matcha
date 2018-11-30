import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedTextFields from './../../components/OutlinedTextFields/OutlinedTextFields.js';
import UserPhotos from './UserPhotos/UserPhotos.js';
import UserActions from './UserActions/UserActions.js';
import { getUserProfileByLogin } from './../../api/api.js';

const styles = theme => ({
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px'
  }
});

class User extends React.Component {
  componentDidMount() {
    getUserProfileByLogin(this.props.login)
      .then(response => {
        if (response.status === 500) {
          this.setState({
            login: null
          });
        }
        return response.json();
      })
      .then(data => {
        this.setState(data);
      });
  }

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    if (!this.state.login) {
      return <div>User not found</div>;
    }
    const {
      login,
      firstname,
      lastname,
      gender,
      preferences,
      bio,
      interests,
      gallery,
      fame,
      time,
      online,
      fake
    } = this.state;

    return (
      <form>
        <UserActions canLike={this.props.canLike} login={login} fame={fame} time={time} online={online} fake={fake} />
        <UserPhotos gallery={gallery} />
        <div className={this.props.classes.profileDetails}>
          <OutlinedTextFields
            label="First name"
            name="firstname"
            value={firstname}
            disabled
          />
          <OutlinedTextFields
            label="Last name"
            name="lastname"
            value={lastname}
            disabled
          />
          <OutlinedTextFields
            label="Age"
            name="age"
            value={this.state.age}
            type="number"
            variant="outlined"
            disabled
          />
          <OutlinedTextFields label="Gender" value={gender} disabled />
          <OutlinedTextFields
            label="Preferences"
            value={preferences}
            disabled
          />
          <OutlinedTextFields
            label="Biography"
            name="bio"
            value={bio}
            disabled
          />
          <OutlinedTextFields
            label="Interests"
            value={interests && interests.join(' ,')}
            disabled
          />
        </div>
      </form>
    );
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(User);
