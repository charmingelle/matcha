import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import LikeButton from './LikeButton/LikeButton';
import BlockButton from './BlockButton/BlockButton';
import { reportFake } from '../../api/api';
import { styles } from './User.styles';
import { withContext } from '../../utils/utils';

class User extends React.Component {
  componentDidMount = () => {
    this.props.full && this.props.context.updateVisited(this.props.user.login);
    this.setState({
      ...this.props.user,
      currentPhoto: 0,
      expanded: this.props.full,
      isMenuOpen: false,
    });
  };

  showPreviousPhoto = () =>
    this.setState({
      currentPhoto: this.state.currentPhoto - 1,
    });

  showNextPhoto = () => {
    this.props.context.updateVisited(this.state.login);
    this.setState({
      currentPhoto: this.state.currentPhoto + 1,
    });
  };

  toggleMenu = () =>
    this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));

  changeFame = step =>
    this.setState({
      fame: this.state.fame + step,
    });

  reportFake = () =>
    reportFake(this.state.login).then(() =>
      this.setState({
        fake: true,
      }),
    );

  handleExpandClick = () => {
    this.setState(
      state => ({ expanded: !state.expanded }),
      () =>
        this.state.expanded &&
        this.props.context.updateVisited(this.state.login),
    );
  };

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
    const { classes, full } = this.props;
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
      isMenuOpen,
    } = this.state;
    const avatar = gallery.length > 0 ? gallery[avatarid] : 'avatar.png';
    const currentPhotoFile =
      gallery.length > 0 ? gallery[currentPhoto] : 'avatar.png';

    return (
      <Card className={full ? classes.cardFull : classes.card}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="Recipe"
              className={classes.avatar}
              alt={`${firstname} ${lastname}`}
              src={`/${avatar}`}
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
                        placement === 'bottom' ? 'center top' : 'center bottom',
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
              ? 'Online'
              : parseInt(time) === 0
              ? null
              : new Date(parseInt(time)).toLocaleString()
          }
        />
        <CardContent
          className={full ? classes.photoContentFull : classes.photoContent}
        >
          <img
            className={classes.img}
            src={`/${currentPhotoFile}`}
            alt={`${currentPhotoFile}`}
          />
        </CardContent>
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
        {!full && (
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
        )}
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div className={classes.likeBlock}>
              <LikeButton
                disabled={!this.props.context.profile.canRenderLikeButton}
                changeFame={this.changeFame}
                login={login}
              />
              <div>{fame}</div>
            </div>
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
            {interests.length > 0 && (
              <Typography component="p">
                <span className={classes.bold}>Interests: </span>
                {interests.join(', ')}
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(User));
