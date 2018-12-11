import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LikeButton from "./LikeButton/LikeButton.js";
import BlockButton from "./BlockButton/BlockButton.js";
import { reportFake } from "./../../api/api.js";

const styles = {
  root: {
    display: "flex",
    justifyContent: "center"
  },
  container: {
    width: "614px",
    margin: "40px",
    border: "1px solid rgba(0, 0, 0, 0.54)"
  },
  info: {
    display: "flex",
    padding: "15px"
  },
  name: {
    marginRight: "10px"
  },
  timeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  online: {
    width: "5px",
    height: "5px",
    borderRadius: "100%",
    backgroundColor: "green"
  },
  photoContainer: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  left: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translate(0, -50%)"
  },
  right: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translate(0, -50%)"
  },
  photo: {
    maxWidth: "100%",
    maxHeight: "100%"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between"
  },
  goodActions: {
    display: "flex",
    alignItems: "center",
    padding: "15px"
  },
  badActions: {
    display: "flex",
    alignItems: "center",
    padding: "15px"
  },
  fake: {
    marginRight: "5px"
  },
  fame: {
    marginLeft: "5px"
  },
  showMore: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "15px"
  },
  details: {
    margin: "15px"
  },
  bold: {
    fontWeight: "bold"
  }
};

class User extends React.Component {
  componentDidMount = () => {
    this.setState(this.props.user);
    this.setState({
      currentPhoto: 0,
      full: this.props.full
    });

    let newGallery = this.props.user.gallery.filter(photo => photo !== "");
    let temp = newGallery[0];

    newGallery[0] = newGallery[this.props.user.avatarid];
    newGallery[this.props.user.avatarid] = temp;
    this.setState({
      gallery: newGallery
    });
  };

  showPreviousPhoto = () => {
    this.setState({
      currentPhoto: this.state.currentPhoto - 1
    });
  };

  showNextPhoto = () => {
    this.setState({
      currentPhoto: this.state.currentPhoto + 1
    });
  };

  toggleFull = () => {
    this.setState({
      full: !this.state.full
    });
  };

  changeFame = step => {
    this.setState({
      fame: this.state.fame + step
    });
  };

  reportFake = () =>
    reportFake(this.state.login).then(() =>
      this.setState({
        fake: true
      })
    );

  render = () => {
    if (!this.state) {
      return <span>Loading...</span>;
    }
    const { classes, photoFolder } = this.props;
    const {
      login,
      firstname,
      lastname,
      online,
      time,
      currentPhoto,
      gallery,
      fame,
      full,
      age,
      gender,
      preferences,
      bio,
      interests,
      fake
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.info}>
            <div className={classes.name}>
              {firstname} {lastname}
            </div>
            <div className={classes.timeContainer}>
              {online ? (
                <div className={classes.online} />
              ) : (
                <div>
                  Last seen on {new Date(parseInt(time)).toLocaleString()}
                </div>
              )}
            </div>
          </div>
          <div className={classes.photoContainer}>
            {currentPhoto > 0 && (
              <button className={classes.left} onClick={this.showPreviousPhoto}>
                Left
              </button>
            )}
            {
              <img
                className={classes.photo}
                alt="face"
                src={`${photoFolder}${gallery[currentPhoto]}`}
              />
            }
            {currentPhoto < gallery.length - 1 && (
              <button className={classes.right} onClick={this.showNextPhoto}>
                Right
              </button>
            )}
          </div>
          <div className={classes.actions}>
            <div className={classes.goodActions}>
              <LikeButton
                changeFame={this.changeFame}
                socket={this.props.socket}
                sender={this.props.sender}
                login={login}
              />
              <div className={classes.fame}>{fame > 0 && fame}</div>
            </div>
            <div className={classes.badActions}>
              {fake ? (
                <div className={classes.fake}>Fake</div>
              ) : (
                <button className={classes.fake} onClick={this.reportFake}>
                  Report Fake
                </button>
              )}
              <BlockButton className={classes.blockButton} login={login} />
            </div>
          </div>
          <div className={classes.showMore}>
            <button onClick={this.toggleFull}>
              {full ? "Show less" : "Show more"}
            </button>
          </div>
          {full && (
            <div className={classes.details}>
              <div>
                <span className={classes.bold}>Age: </span>
                {age}
              </div>
              <div>
                <span className={classes.bold}>Gender: </span>
                {gender}
              </div>
              <div>
                <span className={classes.bold}>Sexual preferences: </span>
                {preferences}
              </div>
              {bio && (
                <div>
                  <span className={classes.bold}>Biography: </span>
                  {bio}
                </div>
              )}
              {interests.length > 0 && (
                <div>
                  <span className={classes.bold}>Interests: </span>
                  {interests.join(", ")}
                </div>
              )}
              <div />
            </div>
          )}
        </div>
      </div>
    );
  };
}

User.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(User);
