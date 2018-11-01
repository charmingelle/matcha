import React from 'react';

import UserEditor from './UserEditor/UserEditor';
import Gallery from '../Gallery/Gallery';

import { getUser } from '../../api/randomUser';

class Profile extends React.Component {
  state = {
    userInfo: null,
    gallery: [],
    fames: 0,
  };

  async componentDidMount() {
    const [ user ] = await getUser();

    this.setState({
      userInfo: {
        gender: user.gender,
        bio: user.location.street,
        sexPreferences: Math.random() > 0.5 ? 'hetero' : 'bi',
        interests:
          Math.random() > 0.5 ? ['books', 'music'] : ['movies', 'sport'],
      },
      gallery: [user.picture.large]
    });
  }

  onUserEditorSubmit = userInfo => {
    this.setState({ userInfo }, () => console.log(this.state));
  };

  render() {
    const { userInfo, gallery } = this.state;

    if (!userInfo) {
      return <span>Loader is here</span>
    }

    return (
      <div className="user-profile">
        <UserEditor initValue={userInfo} onSubmit={this.onUserEditorSubmit} />
        <Gallery images={gallery}/>
      </div>
    );
  }
}

export default Profile;
