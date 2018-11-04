import React from 'react';
import UserEditor from './UserEditor/UserEditor';
import Gallery from './../Gallery/Gallery';
import { getUser } from './../../api/randomUser';
import { getUserProfile } from './../../api/getUser';
import ProfilePhotos from './../ProfilePhotos/ProfilePhotos.js'

class Profile extends React.Component {
  state = {
    userInfo: null,
    gallery: [],
    fames: 0
  };

  async componentDidMount() {
    // const [user] = await getUser();

    // this.setState({
    //   userInfo: {
    //     gender: user.gender,
    //     sexPreferences:
    //       Math.random() > 0.5
    //         ? 'heterosexual'
    //         : Math.random() > 0.5
    //           ? 'homosectual'
    //           : 'bisexual',
    //     bio: user.location.street,
    //     interests:
    //       Math.random() > 0.5 ? ['books', 'music'] : ['movies', 'sport'],
    //     allInterests: ['books', 'music', 'movies', 'sport']
    //   },
    //   gallery: [user.picture.large, user.picture.medium, user.picture.thumbnail]
    // });

    const user = await getUserProfile(0);    

    this.setState({
      userInfo: {
        gender: user.gender,
        sexPreferences: user.sexPreferences,
        bio: user.bio,
        interests: user.interests,
        allInterests: user.allInterests
      },
      gallery: user.gallery
    });
  }

  onUserEditorSubmit = userInfo => {
    this.setState({ userInfo }, () => console.log(this.state));
  };

  render() {
    const { userInfo, gallery } = this.state;

    if (!userInfo) {
      return <span>Loader is here</span>;
    }

    return (
      <div className="user-profile">
        {/* <Gallery images={gallery} /> */}
        <ProfilePhotos />
        <UserEditor initValue={userInfo} onSubmit={this.onUserEditorSubmit} />
      </div>
    );
  }
}

export default Profile;
