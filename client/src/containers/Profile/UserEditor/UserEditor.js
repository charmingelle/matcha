import React from 'react';
import SimpleSelect from './../../../components/SimpleSelect/SimpleSelect.js';
import OutlinedTextFields from './../../../components/OutlinedTextFields/OutlinedTextFields.js';
import DownshiftMultiple from './../../../components/DownshiftMultiple/DownshiftMultiple.js';
import Button from '@material-ui/core/Button';

class UserEditor extends React.Component {
  state = this.props.initValue;

  onChange = target => {
    this.setState(target);
  };

  onSubmit = ev => {
    ev.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { gender, sexPreferences, bio, interests, allInterests } = this.state;

    return (
      <form>
        <SimpleSelect
          title="Gender"
          items={['male', 'female']}
          name="gender"
          value={gender}
          onChange={this.onChange}
        />
        <SimpleSelect
          title="Preferences"
          items={['heterosexual', 'homosectual', 'bisexual']}
          name="sexPreferences"
          value={sexPreferences}
          onChange={this.onChange}
        />
        <OutlinedTextFields
          label="Biography"
          placeholder="Tell us a few words about yourself"
          name="bio"
          value={bio}
          onChange={this.onChange}
        />
        <DownshiftMultiple
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
