import React from 'react';
import SimpleSelect from './../../components/SimpleSelect/SimpleSelect.js';
import OutlinedTextFields from './../../components/OutlinedTextFields/OutlinedTextFields.js';
import InterestsInput from './../../components/InterestsInput/InterestsInput.js';
import ProfilePhotos from './../ProfilePhotos/ProfilePhotos.js';
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
      gender: data.user.gender,
      preferences: data.user.preferences,
      bio: data.user.bio,
      interests: data.user.interests,
      gallery: data.user.gallery,
      avatarid: data.user.avatarid,
      allInterests: data.allInterests
    });
  }

  onSubmit = event => {
    event.preventDefault();
    saveUserProfile(this.state);
  };

  onChange = target => {
    console.log(target);
    this.setState(target);
  };

  render() {
    if (!this.state) {
      return <span>Loader is here</span>;
    }
    const { id, gender, preferences, bio, interests, gallery, avatarid } = this.state;

    return (
      <form>
        <ProfilePhotos userid={id} gallery={gallery} avatarid={avatarid} onChange={this.onChange} />
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
