import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SimpleSelect from './../../components/SimpleSelect/SimpleSelect.js';
import OutlinedTextFields from './../../components/OutlinedTextFields/OutlinedTextFields.js';
import InterestsInput from './../../components/InterestsInput/InterestsInput.js';
import ProfilePhotos from './ProfilePhotos/ProfilePhotos.js';
import ChangeStatus from './../ChangeStatus/ChangeStatus.js';
import Button from '@material-ui/core/Button';
import { saveUserProfile } from './../../api/api.js';
import { isEmailValid } from './../../utils/utils.js';

const styles = theme => ({
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px'
  }
});

class Profile extends React.Component {
  componentDidMount() {
    this.setState(this.props.value);
  }

  isEmailValid = email => {
    const validStatus = isEmailValid(email);

    if (!validStatus) {
      this.setState({
        changeStatus: 'Please make sure that your email address is correct',
        error: true
      });
    }
    return validStatus;
  };

  validateEmpty = value => {
    if (value === '') {
      this.setState({
        changeStatus: 'Please fill all the fields in',
        error: true
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
      saveUserProfile(this.state)
        .then(res => {
          res.status === 200
            ? this.setState({ error: false })
            : this.setState({ error: true });
          return res.json();
        })
        .then(data => {
          this.setState({
            changeStatus: data.result
          });
          this.props.onChange(this.state);
        });
    }
  };

  onChange = target => {
    this.setState(target);
  };

  onAgeChange = event => {
    if (event.target.value >= 18) {
      this.setState({
        age: event.target.value
      });
    }
  };

  renderChangeStatus = value => {
    if (this.state.changeStatus) {
      return (
        <ChangeStatus
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
      id,
      login,
      firstname,
      lastname,
      email,
      gender,
      preferences,
      bio,
      interests,
      gallery,
      avatarid
    } = this.state;

    return (
      <form>
        <ProfilePhotos
          userid={id}
          gallery={gallery}
          avatarid={avatarid}
          editable={this.props.editable}
        />
        <div className={this.props.classes.profileDetails}>
          {this.renderChangeStatus()}
          <OutlinedTextFields
            label="First name"
            name="firstname"
            value={firstname}
            onChange={this.onChange}
          />
          <OutlinedTextFields
            label="Last name"
            name="lastname"
            value={lastname}
            onChange={this.onChange}
          />
          <OutlinedTextFields
            label="Email address"
            name="email"
            value={email}
            validate={this.isEmailValid}
            onChange={this.onChange}
          />
          <OutlinedTextFields
            label="Age"
            name="age"
            value={this.state.age}
            onChange={this.onAgeChange}
            type="number"
            variant="outlined"
            className={this.props.classes.ageInput}
          />
          <SimpleSelect
            title="Gender"
            items={['male', 'female']}
            name="gender"
            value={gender}
            onChange={this.onChange}
          />
          <SimpleSelect
            title="Preferences"
            items={['heterosexual', 'homosexual', 'bisexual']}
            name="preferences"
            value={preferences}
            onChange={this.onChange}
          />
          <OutlinedTextFields
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
          <Button variant="outlined" onClick={this.onSubmit}>
            Save changes
          </Button>
        </div>
      </form>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
