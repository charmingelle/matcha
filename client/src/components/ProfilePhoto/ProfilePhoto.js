class ProfilePhoto extends React.Component {
  render() {
    <GridListTile key={id} cols={2} rows={2}>
      <img src={photo} alt="" onClick={this.upload.bind(this, id)} />
      <GridListTileBar
        titlePosition="top"
        actionIcon={
          <IconButton
            className={
              this.state.avatarid === id ? classes.avatar : classes.icon
            }
            onClick={this.makeAvatar.bind(this, id)}
          >
            <StarBorderIcon />
          </IconButton>
        }
        actionPosition="left"
        className={classes.titleBar}
      />
    </GridListTile>
  }
}
