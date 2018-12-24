import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SimpleSelect from "./../../components/SimpleSelect/SimpleSelect.js";
import OutlinedTextFields from "./../../components/OutlinedTextFields/OutlinedTextFields.js";
import InterestsInput from "./../../components/InterestsInput/InterestsInput.js";
import ProfilePhotos from "./ProfilePhotos/ProfilePhotos.js";
import ChangeStatus from "./../ChangeStatus/ChangeStatus.js";
import SmallUsers from "./../SmallUsers/SmallUsers.js";
import Button from "@material-ui/core/Button";
import { saveUserProfile, getLikedBy, getCheckedBy } from "./../../api/api.js";
import { isEmailValid } from "./../../utils/utils.js";

const styles = theme => ({
  root: {
    overflow: "auto",
    padding: "10px"
  },
  profileDetails: {
    display: "flex",
    flexDirection: "column",
    padding: 8,
    backgroundColor: "#ffffff"
  },
  saveChangesButton: {
    padding: "8px"
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
        changeStatus: "Please make sure that your email address is correct",
        error: true
      });
    }
    return validStatus;
  };

  validateEmpty = value => {
    if (value === "") {
      this.setState({
        changeStatus: "Please fill all the fields in",
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
          if (data.suggestions) {
            this.props.updateSuggestions(data.suggestions);
          }
          this.props.onChange(this.state);
        });
    }
  };

  onChange = target => {
    this.setState(target);
  };

  onAgeChange = age => {
    if (age >= 18 && age <= 100) {
      this.setState({
        age
      });
    }
  };

  renderChangeStatus = () => {
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
      firstname,
      lastname,
      email,
      gender,
      preferences,
      bio,
      age,
      interests,
      gallery,
      avatarid
    } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <SmallUsers
          title="Liked by"
          icon="&#9829;"
          getUserList={getLikedBy}
          visited={this.props.visited}
          updateVisited={this.props.updateVisited}
        />
        <SmallUsers
          title="Checked by"
          icon="&#10004;"
          getUserList={getCheckedBy}
          visited={this.props.visited}
          updateVisited={this.props.updateVisited}
        />
        <div className={classes.profileDetails}>
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
            value={age}
            onChange={this.onAgeChange}
            type="number"
            variant="outlined"
          />
          <SimpleSelect
            title="Gender"
            items={["male", "female"]}
            name="gender"
            value={gender}
            onChange={this.onChange}
          />
          <SimpleSelect
            title="Preferences"
            items={["heterosexual", "homosexual", "bisexual"]}
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
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
