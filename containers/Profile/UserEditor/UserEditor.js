import React from 'react';

class UserEditor extends React.Component {
  state = this.props.initValue;

  onChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    });
  };

  onSubmit = ev => {
    ev.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const { sexPreferences, gender, bio, interests } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="sexPreferences"
          value={sexPreferences}
          onChange={this.onChange}
        />
        <input name="gender" value={gender} onChange={this.onChange} />
        <input name="bio" value={bio} onChange={this.onChange} />
        <input name="interests" value={interests} onChange={this.onChange} />
        <div>
          <button>Submit</button>
        </div>
      </form>
    );
  }
}

export default UserEditor;
