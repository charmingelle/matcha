import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LeftIcon from "@material-ui/icons/ChevronLeft";
import RightIcon from "@material-ui/icons/ChevronRight";
import LikeButton from "./LikeButton/LikeButton.js";
import BlockButton from "./BlockButton/BlockButton.js";
import { reportFake } from "./../../api/api.js";

const styles = theme => ({
  card: {
    margin: 50,
    width: 500,
    height: "100%"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  leftRightArea: {
    position: "relative",
    height: 30
  },
  right: {
    position: "absolute",
    right: 0
  },
  bold: {
    fontWeight: 500
  }
});

class User extends React.Component {
  componentDidMount = () => {
    this.setState(this.props.user);
    this.setState({
      currentPhoto: 0,
      expanded: this.props.full,
      isMenuOpen: false
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
    this.props.updateVisited(this.state.login);
    this.setState({
      currentPhoto: this.state.currentPhoto + 1
    });
  };

  toggleMenu = () => {
    this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));
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

  handleExpandClick = () =>
    this.setState(state => ({ expanded: !state.expanded }));

  handleMenuClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ isMenuOpen: false });
  };

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
      avatarid,
      fame,
      age,
      gender,
      preferences,
      bio,
      interests,
      fake,
      isMenuOpen
    } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="Recipe"
              className={classes.avatar}
              alt={`${firstname} ${lastname}`}
              src={`${photoFolder}/${gallery[avatarid]}`}
            />
          }
          action={
            <div>
              <IconButton
                buttonRef={node => {
                  this.anchorEl = node;
                }}
                onClick={this.toggleMenu}
              >
                <MoreVertIcon />
              </IconButton>
              <Popper
                open={isMenuOpen}
                anchorEl={this.anchorEl}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    id="menu-list-grow"
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom"
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleMenuClose}>
                        <MenuList>
                          <MenuItem>
                            <BlockButton login={login} />
                          </MenuItem>
                          {!fake && (
                            <MenuItem>
                              <div onClick={this.reportFake}>Report Fake</div>
                            </MenuItem>
                          )}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          }
          title={`${firstname} ${lastname}`}
          subheader={
            online
              ? "Online"
              : `Last seen on ${new Date(parseInt(time)).toLocaleString()}`
          }
        />
        <CardMedia
          className={classes.media}
          image={`${photoFolder}/${gallery[currentPhoto]}`}
        />
        <div className={classes.leftRightArea}>
          {currentPhoto > 0 && (
            <IconButton onClick={this.showPreviousPhoto}>
              <LeftIcon />
            </IconButton>
          )}
          {currentPhoto < gallery.length - 1 && (
            <IconButton className={classes.right} onClick={this.showNextPhoto}>
              <RightIcon />
            </IconButton>
          )}
        </div>
        <CardContent>
          <Typography component="p">
            <span className={classes.bold}>Age: </span>
            {age}
          </Typography>
          <Typography component="p">
            <span className={classes.bold}>Gender: </span>
            {gender}
          </Typography>
          <Typography component="p">
            <span className={classes.bold}>Sexual preferences: </span>
            {preferences}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <LikeButton
            changeFame={this.changeFame}
            socket={this.props.socket}
            sender={this.props.sender}
            login={login}
            updateChatData={this.props.updateChatData}
          />
          <div>{fame}</div>
          {(interests.length > 0 || bio) && (
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {interests.length > 0 && (
              <Typography component="p">
                <span className={classes.bold}>Interests: </span>
                {interests.join(", ")}
              </Typography>
            )}
            {bio && (
              <Typography component="p">
                <span className={classes.bold}>Biography: </span>
                {bio}
              </Typography>
            )}
          </CardContent>
        </Collapse>
      </Card>
    );
  };
}

User.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(User);
