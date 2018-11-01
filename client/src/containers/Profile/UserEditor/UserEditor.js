import React from 'react';
import SimpleSelect from './../../../components/SimpleSelect/SimpleSelect.js';
import OutlinedTextFields from './../../../components/OutlinedTextFields/OutlinedTextFields.js';

class UserEditor extends React.Component {
  state = this.props.initValue;

  // onChange = ({ target }) => {
  //   this.setState({
  //     [target.name]: target.value
  //   });
  // };

  onChange = (target) => {
    this.setState(target);
  };

  onSubmit = ev => {
    ev.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { gender, sexPreferences, bio, interests } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        {/* <input name="gender" value={gender} onChange={this.onChange} /> */}
        <SimpleSelect
          title="Gender"
          items={['male', 'female']}
          name="gender"
          value={gender}
          onChange={this.onChange}
        />

        {/* <input
          name="sexPreferences"
          value={sexPreferences}
          onChange={this.onChange}
        /> */}
        <SimpleSelect
          title="Preferences"
          items={['heterosexual', 'homosectual', 'bisexual']}
          name="sexPreferences"
          value={sexPreferences}
          onChange={this.onChange}
        />

        {/* <input name="bio" value={bio} onChange={this.onChange} /> */}
        <OutlinedTextFields
          label="Biography"
          placeholder="Tell us a few words about yourself"
          name="bio"
          value={bio}
          onChange={this.onChange}
        />

        <input name="interests" value={interests} onChange={this.onChange} />
        <div>
          <button>Submit</button>
        </div>
      </form>
    );
  }
}

export default UserEditor;
