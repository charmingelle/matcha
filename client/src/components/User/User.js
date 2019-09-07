import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './User.styles';
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
import { withContext } from '../../utils/utils';

class User extends React.Component {
  api = this.props.context.api;

  state = {
    currentPhoto: 0,
    expanded: this.props.full,
    isMenuOpen: false,
  };

  componentDidMount = () =>
    this.props.full && this.props.context.updateVisited(this.props.user.login);

  showPreviousPhoto = () =>
    this.setState({
      currentPhoto: this.state.currentPhoto - 1,
    });

  showNextPhoto = () =>
    this.setState(
      {
        currentPhoto: this.state.currentPhoto + 1,
      },
      () => this.props.context.updateVisited(this.props.user.login),
    );

  toggleMenu = () =>
    this.setState(state => ({ isMenuOpen: !state.isMenuOpen }));

  block = (dialogLogin, dialogName) => () => {
    this.props.context.set('isBlockDialogOpen', true);
    this.props.context.set('dialogLogin', dialogLogin);
    this.props.context.set('dialogName', dialogName);
  };

  reportFake = (dialogLogin, dialogName) => () => {
    this.props.context.set('isFakeDialogOpen', true);
    this.props.context.set('dialogLogin', dialogLogin);
    this.props.context.set('dialogName', dialogName);
  };

  handleExpandClick = () =>
    this.setState(
      state => ({ expanded: !state.expanded }),
      () =>
        this.state.expanded &&
        this.props.context.updateVisited(this.props.user.login),
    );

  handleMenuClose = event =>
    !this.anchorEl.contains(event.target) &&
    this.setState({ isMenuOpen: false });

  renderActionMenu = () => {
    const {
      user: { login, firstname, lastname, fake },
    } = this.props;
    const { isMenuOpen } = this.state;

    return (
      <div>
        <IconButton
          buttonRef={node => (this.anchorEl = node)}
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
                    <MenuItem
                      onClick={this.block(login, `${firstname} ${lastname}`)}
                    >
                      Block
                    </MenuItem>
                    {!fake && (
                      <MenuItem
                        onClick={this.reportFake(
                          login,
                          `${firstname} ${lastname}`,
                        )}
                      >
                        Report as Fake
                      </MenuItem>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  };

  getName = (firstname, lastname) => `${firstname} ${lastname}`;

  getAvatarSrc = (gallery, avatarid) => `/${gallery[avatarid]}`;

  getOnlineTime = (online, time) =>
    online
      ? 'Online'
      : parseInt(time) === 0
      ? null
      : new Date(parseInt(time)).toLocaleString();

  renderHeader = () => {
    const {
      classes,
      user: { login, firstname, lastname, online, time, gallery, avatarid },
    } = this.props;
    const name = this.getName(firstname, lastname);

    return (
      <CardHeader
        avatar={
          <Link to={`/users/${login}`}>
            <Avatar
              aria-label="Recipe"
              className={classes.avatar}
              alt={name}
              src={this.getAvatarSrc(gallery, avatarid)}
            />
          </Link>
        }
        action={this.renderActionMenu()}
        title={name}
        subheader={this.getOnlineTime(online, time)}
      />
    );
  };

  renderPhoto = () => {
    const {
      classes,
      full,
      user: { gallery },
    } = this.props;
    const { currentPhoto } = this.state;

    return (
      <CardContent
        className={full ? classes.photoContentFull : classes.photoContent}
      >
        <img
          className={classes.img}
          src={`/${gallery[currentPhoto]}`}
          alt={gallery[currentPhoto]}
        />
      </CardContent>
    );
  };

  renderPhotoButtons = () => {
    const {
      classes,
      user: { gallery },
    } = this.props;
    const { currentPhoto } = this.state;

    return (
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
    );
  };

  renderShowMore = () => {
    const { classes, full } = this.props;
    const { expanded } = this.state;

    return full ? null : (
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={this.handleExpandClick}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
    );
  };

  renderInfo = () => {
    const {
      classes,
      user: { login, fame, age, gender, preferences, bio, interests, fake },
    } = this.props;
    const { expanded } = this.state;

    return (
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div className={classes.likeBlock}>
            <LikeButton
              disabled={!this.props.context.profile.canRenderLikeButton}
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
          {fake && (
            <Typography component="p">
              <span className={classes.fake}>Fake: </span>
              This user was reported as fake
            </Typography>
          )}
        </CardContent>
      </Collapse>
    );
  };

  render = () => (
    <Card
      className={
        this.props.full ? this.props.classes.cardFull : this.props.classes.card
      }
    >
      {this.renderHeader()}
      {this.renderPhoto()}
      {this.renderPhotoButtons()}
      {this.renderShowMore()}
      {this.renderInfo()}
    </Card>
  );
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(User));
