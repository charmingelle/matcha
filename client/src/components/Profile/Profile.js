import React from 'react';
import SimpleSelect from './../../components/SimpleSelect/SimpleSelect.js';
import OutlinedTextFields from './../../components/OutlinedTextFields/OutlinedTextFields.js';
import InterestsInput from './../../components/InterestsInput/InterestsInput.js';
import ProfilePhotos from './../ProfilePhotos/ProfilePhotos.js';
import Error from './../Error/Error.js';
import Button from '@material-ui/core/Button';
import {
  getUserProfile,
  saveUserProfile
} from './../../api/profileRequests.js';

class Profile extends React.Component {
  async componentDidMount() {
    const data = await getUserProfile(3);

    this.setState({
      id: data.user.id,
      firstname: data.user.firstname,
      lastname: data.user.lastname,
      email: data.user.email,
      gender: data.user.gender,
      preferences: data.user.preferences,
      bio: data.user.bio,
      interests: data.user.interests,
      gallery: data.user.gallery,
      avatarid: data.user.avatarid,
      allInterests: data.allInterests,
      error: null
    });
  }

  validateEmpty = (value) => {
    console.log('value', value);
    console.log("value === ''", value === '');

    if (value === '') {
      this.setState({ error: 'Please fill all the fields in' });
      return false;
    }
    return true;
  }

  validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(String(email).toLowerCase())) {
      this.setState({ error: 'Please make sure that your email address is correct' });
      return false;
    }
    return true;
  };

  isAllValid = () => {
    let res = true;

    res = res && this.validateEmpty(this.state.firstname);
    res = res && this.validateEmpty(this.state.lastname);
    res = res && this.validateEmpty(this.state.email);
    res = res && this.validateEmail(this.state.email);
    return res;
  }

  onSubmit = event => {
    event.preventDefault();
    if (this.isAllValid()) {
      this.setState({ error: null });
      saveUserProfile(this.state);
    }
  };

  onChange = target => {
    this.setState(target);
  };

  renderError = value => {
    if (this.state.error) {
      return <Error value={this.state.error} />;
    }
  };

  render() {
    if (!this.state) {
      return <span>Loader is here</span>;
    }
    const {
      id,
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
        <ProfilePhotos userid={id} gallery={gallery} avatarid={avatarid} />
        {this.renderError()}
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
          validate={this.validateEmail}
          onChange={this.onChange}
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
      </form>
    );
  }
}

export default Profile;
