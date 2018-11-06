import React from 'react';
import SimpleSelect from './../../../components/SimpleSelect/SimpleSelect.js';
import OutlinedTextFields from './../../../components/OutlinedTextFields/OutlinedTextFields.js';
import InterestsInput from './../../../components/InterestsInput/InterestsInput.js';
import Button from '@material-ui/core/Button';
import ProfilePhotos from './../../ProfilePhotos/ProfilePhotos.js'

class UserEditor extends React.Component {
  state = this.props;

  onChange = target => {
    this.setState(target);
  };

  onSubmit = ev => {
    ev.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { userInfo: {gender, preferences, bio, interests}, allInterests } = this.state;

    return (
      <form>
        <ProfilePhotos photos={this.state.userInfo.gallery} avatarID={this.state.userInfo.avatarID} />
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
          all={allInterests}
          onChange={this.onChange}
        />
        <Button variant="outlined" onClick={this.onSubmit}>
          Save changes
        </Button>
      </form>
    );
  }
}

export default UserEditor;
