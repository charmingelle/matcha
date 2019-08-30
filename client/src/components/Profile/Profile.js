import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ProfileSelect from './ProfileSelect/ProfileSelect';
import ProfileTextField from './ProfileTextField/ProfileTextField';
import InterestsInput from './InterestsInput/InterestsInput';
import ChangeStatusInput from './ChangeStatusInput/ChangeStatusInput';
import ProfilePhotos from './ProfilePhotos/ProfilePhotos';
import SmallUsers from '../SmallUsers/SmallUsers';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { saveUserProfile, getLikedBy, getCheckedBy } from '../../api/api';
import { styles } from './Profile.styles';
import { isEmailValid, withContext } from '../../utils/utils';

class Profile extends React.Component {
  state = this.props.context.profile;

  isEmailValid = email => {
    const validStatus = isEmailValid(email);

    if (!validStatus) {
      this.setState({
        changeStatus: 'Please make sure that your email address is correct',
        error: true,
      });
    }
    return validStatus;
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

  isAllValid = () =>
    this.validateEmpty(this.state.firstname) &&
    this.validateEmpty(this.state.lastname) &&
    this.validateEmpty(this.state.email) &&
    this.isEmailValid(this.state.email);

  onSubmit = async event => {
    event.preventDefault();
    if (this.isAllValid()) {
      const { status, result, suggestions } = await saveUserProfile(this.state);

      this.setState({
        error: status === 'error',
        changeStatus: result,
      });
      suggestions && this.props.context.set('suggestions', suggestions);
      this.props.context.set('profile', this.state);
    }
  };

  onChange = target => this.setState(target);

  onAgeChange = event =>
    event.target.value >= 18 &&
    event.target.value <= 100 &&
    this.setState({
      age: event.target.value,
    });

  renderLikedBy = () => (
    <SmallUsers title="Liked by" icon="&#9829;" getUserList={getLikedBy} />
  );

  renderCheckedBy = () => (
    <SmallUsers title="Checked by" icon="&#10004;" getUserList={getCheckedBy} />
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
      validate={this.isEmailValid}
      onChange={this.onChange}
    />
  );

  renderAge = () => (
    <div className={this.props.classes.ageInput}>
      <label className={this.props.classes.ageLabel} htmlFor="age">
        Age
      </label>
      <Input
        name="age"
        type="number"
        value={this.state.age}
        onChange={this.onAgeChange}
      />
    </div>
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
      all={this.state.allInterests}
      onChange={this.onChange}
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
      {this.renderSaveButton()}
    </div>
  );

  renderProfilePhotos = () => (
    <ProfilePhotos
      gallery={this.state.gallery}
      avatarid={this.state.avatarid}
    />
  );

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
