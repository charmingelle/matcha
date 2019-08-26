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
  componentDidMount = () => this.setState(this.props.context.profile);

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

  isAllValid = () => {
    let res = true;

    res = res && this.validateEmpty(this.state.firstname);
    res = res && this.validateEmpty(this.state.lastname);
    res = res && this.validateEmpty(this.state.email);
    res = res && this.isEmailValid(this.state.email);
    return res;
  };

  onSubmit = event => {
    event.preventDefault();
    if (this.isAllValid()) {
      saveUserProfile(this.state).then(
        data => {
          this.setState({
            error: data.status === 'error',
            changeStatus: data.result,
          });
          if (data.suggestions) {
            this.props.context.set('suggestions', data.suggestions);
          }
          this.props.context.set('profile', this.state);
        },
        error => console.error(error),
      );
    }
  };

  onChange = target => this.setState(target);

  onAgeChange = event => {
    if (event.target.value >= 18 && event.target.value <= 100) {
      this.setState({
        age: event.target.value,
      });
    }
  };

  renderChangeStatus = () => {
    if (this.state.changeStatus) {
      return (
        <ChangeStatusInput
          value={this.state.changeStatus}
          error={this.state.error}
        />
      );
    }
  };

  render() {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const {
      firstname,
      lastname,
      email,
      gender,
      preferences,
      bio,
      age,
      interests,
      gallery,
      avatarid,
    } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <SmallUsers title="Liked by" icon="&#9829;" getUserList={getLikedBy} />
        <SmallUsers
          title="Checked by"
          icon="&#10004;"
          getUserList={getCheckedBy}
        />
        <div className={classes.profileDetails}>
          {this.renderChangeStatus()}
          <ProfileTextField
            label="First name"
            name="firstname"
            value={firstname}
            onChange={this.onChange}
          />
          <ProfileTextField
            label="Last name"
            name="lastname"
            value={lastname}
            onChange={this.onChange}
          />
          <ProfileTextField
            label="Email address"
            name="email"
            value={email}
            validate={this.isEmailValid}
            onChange={this.onChange}
          />
          <div className={classes.ageInput}>
            <label className={classes.ageLabel} htmlFor="age">
              Age
            </label>
            <Input
              name="age"
              type="number"
              value={age}
              onChange={this.onAgeChange}
            />
          </div>
          <ProfileSelect
            title="Gender"
            items={['male', 'female']}
            name="gender"
            value={gender}
            onChange={this.onChange}
          />
          <ProfileSelect
            title="Preferences"
            items={['heterosexual', 'homosexual', 'bisexual']}
            name="preferences"
            value={preferences}
            onChange={this.onChange}
          />
          <ProfileTextField
            label="Biography"
            placeholder="Tell us a few words about yourself"
            name="bio"
            value={bio}
            onChange={this.onChange}
          />
          <InterestsInput
            name="interests"
            value={interests}
            all={this.state.allInterests}
            onChange={this.onChange}
          />
          <Button variant="contained" color="primary" onClick={this.onSubmit}>
            Save changes
          </Button>
        </div>
        <ProfilePhotos gallery={gallery} avatarid={avatarid} />
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(Profile));
