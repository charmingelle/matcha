import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Checkbox } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ProfileSelect from './ProfileSelect/ProfileSelect';
import ProfileTextField from './ProfileTextField/ProfileTextField';
import InterestsInput from './InterestsInput/InterestsInput';
import ChangeStatusInput from './ChangeStatusInput/ChangeStatusInput';
import ProfilePhotos from './ProfilePhotos/ProfilePhotos';
import SmallUsers from '../SmallUsers/SmallUsers';
import { styles } from './Profile.styles';
import {
  MIN_AGE,
  MAX_AGE,
  LATITUDE_LIMIT,
  LONGITUDE_LIMIT,
  isEmailValid,
  isAgeValid,
  isLatitudeValid,
  isLongitudeValid,
  withContext,
} from '../../utils/utils';

class Profile extends React.Component {
  api = this.props.context.api;

  state = {
    ...this.props.context.profile,
    latitude: this.props.context.profile.location[0],
    longitude: this.props.context.profile.location[1],
    changeStatus: '',
    error: false,
  };

  validateEmpty = value => {
    if (value === '') {
      this.setState({
        changeStatus: 'Please fill all the fields in',
        error: true,
      });
      return false;
    }
    return true;
  };

  isEmailValid = email => {
    if (!isEmailValid(email)) {
      this.setState({
        changeStatus: 'Please make sure that your email address is correct',
        error: true,
      });
      return false;
    }
    return true;
  };

  isAgeValid = age => {
    if (!isAgeValid(age)) {
      this.setState({
        changeStatus: `Please make sure that your age is an integer between ${MIN_AGE} and ${MAX_AGE}`,
        error: true,
      });
      return false;
    }
    return true;
  };

  isLatitudeValid = latitude => {
    if (!isLatitudeValid(latitude)) {
      this.setState({
        changeStatus: `Please make sure that your latitude is between -${LATITUDE_LIMIT} and ${LATITUDE_LIMIT}`,
        error: true,
      });
      return false;
    }
    return true;
  };

  isLongitudeValid = longitude => {
    if (!isLongitudeValid(longitude)) {
      this.setState({
        changeStatus: `Please make sure that your longitude is between -${LONGITUDE_LIMIT} and ${LONGITUDE_LIMIT}`,
        error: true,
      });
      return false;
    }
    return true;
  };

  isAllValid = () =>
    this.validateEmpty(this.state.firstname) &&
    this.validateEmpty(this.state.lastname) &&
    this.validateEmpty(this.state.email) &&
    this.validateEmpty(this.state.age) &&
    this.validateEmpty(this.state.latitude) &&
    this.validateEmpty(this.state.longitude) &&
    this.isEmailValid(this.state.email) &&
    this.isAgeValid(this.state.age) &&
    this.isLatitudeValid(this.state.latitude) &&
    this.isLongitudeValid(this.state.longitude);

  onSubmit = async event => {
    event.preventDefault();
    if (this.isAllValid()) {
      try {
        const {
          firstname,
          lastname,
          email,
          age: stringAge,
          gender,
          preferences,
          bio,
          interests,
          locatable,
          latitude,
          longitude,
          login,
        } = this.state;
        const profile = {
          firstname,
          lastname,
          email,
          age: parseInt(stringAge),
          gender,
          preferences,
          bio,
          interests,
          locatable,
          location: [parseFloat(latitude), parseFloat(longitude)],
          login,
        };

        this.props.context.set(
          'profile',
          await this.api.saveUserProfile(profile),
        );
        this.props.context.set('suggestions', await this.api.getSuggestions());
        this.props.context.set('interests', await this.api.getAllinterests());
        this.setState({
          error: false,
          changeStatus: 'Your data has been changed',
        });
      } catch ({ message }) {
        this.setState({
          error: true,
          changeStatus: message,
        });
      }
    }
  };

  onChange = target => this.setState(target);

  onCheckboxChange = ({ target: { checked } }) =>
    this.setState({
      locatable: checked,
    });

  renderLikedBy = () => (
    <SmallUsers
      title="Liked by"
      icon="&#9829;"
      users={this.props.context.likedBy}
    />
  );

  renderCheckedBy = () => (
    <SmallUsers
      title="Checked by"
      icon="&#10004;"
      users={this.props.context.checkedBy}
    />
  );

  renderChangeStatus = () =>
    this.state.changeStatus && (
      <ChangeStatusInput
        value={this.state.changeStatus}
        error={this.state.error}
      />
    );

  renderFirstName = () => (
    <ProfileTextField
      label="First name"
      name="firstname"
      value={this.state.firstname}
      onChange={this.onChange}
    />
  );

  renderLastName = () => (
    <ProfileTextField
      label="Last name"
      name="lastname"
      value={this.state.lastname}
      onChange={this.onChange}
    />
  );

  renderEmail = () => (
    <ProfileTextField
      label="Email address"
      name="email"
      value={this.state.email}
      onChange={this.onChange}
    />
  );

  renderAge = () => (
    <ProfileTextField
      label="Age"
      name="age"
      value={this.state.age}
      onChange={this.onChange}
      type="number"
    />
  );

  renderGender = () => (
    <ProfileSelect
      title="Gender"
      items={['male', 'female']}
      name="gender"
      value={this.state.gender}
      onChange={this.onChange}
    />
  );

  renderPreferences = () => (
    <ProfileSelect
      title="Preferences"
      items={['heterosexual', 'homosexual', 'bisexual']}
      name="preferences"
      value={this.state.preferences}
      onChange={this.onChange}
    />
  );

  renderBio = () => (
    <ProfileTextField
      label="Biography"
      placeholder="Tell us a few words about yourself"
      name="bio"
      value={this.state.bio}
      onChange={this.onChange}
    />
  );

  renderInterests = () => (
    <InterestsInput
      name="interests"
      value={this.state.interests}
      all={this.props.context.interests}
      onChange={this.onChange}
    />
  );

  renderLocatableCheckbox = () => (
    <FormControlLabel
      control={
        <Checkbox
          checked={this.state.locatable}
          onChange={this.onCheckboxChange}
          color="primary"
        />
      }
      label="Set location manually"
    />
  );

  renderLatitude = () => (
    <ProfileTextField
      label="Latitude"
      name="latitude"
      value={this.state.latitude}
      onChange={this.onChange}
      type="number"
      disabled={!this.state.locatable}
    />
  );

  renderLongitude = () => (
    <ProfileTextField
      label="Longitude"
      name="longitude"
      value={this.state.longitude}
      onChange={this.onChange}
      type="number"
      disabled={!this.state.locatable}
    />
  );

  renderSaveButton = () => (
    <Button variant="contained" color="primary" onClick={this.onSubmit}>
      Save changes
    </Button>
  );

  renderProfileDetails = () => (
    <div className={this.props.classes.profileDetails}>
      {this.renderChangeStatus()}
      {this.renderFirstName()}
      {this.renderLastName()}
      {this.renderEmail()}
      {this.renderAge()}
      {this.renderGender()}
      {this.renderPreferences()}
      {this.renderBio()}
      {this.renderInterests()}
      {this.renderLocatableCheckbox()}
      {this.renderLatitude()}
      {this.renderLongitude()}
      {this.renderSaveButton()}
    </div>
  );

  renderProfilePhotos = () => <ProfilePhotos />;

  render = () =>
    this.state && (
      <div className={this.props.classes.root}>
        {this.renderLikedBy()}
        {this.renderCheckedBy()}
        {this.renderProfileDetails()}
        {this.renderProfilePhotos()}
      </div>
    );
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Profile));
