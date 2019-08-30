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
  state = {
    fake: this.props.user.fake,
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

  reportFake = () =>
    reportFake(this.props.user.login).then(() =>
      this.setState({
        fake: true,
      }),
    );

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
      user: { login },
    } = this.props;
    const { fake, isMenuOpen } = this.state;

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
      user: { firstname, lastname, online, time, gallery, avatarid },
    } = this.props;
    const name = this.getName(firstname, lastname);

    return (
      <CardHeader
        avatar={
          <Avatar
            aria-label="Recipe"
            className={classes.avatar}
            alt={name}
            src={this.getAvatarSrc(gallery, avatarid)}
          />
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
      user: { login, fame, age, gender, preferences, bio, interests },
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
