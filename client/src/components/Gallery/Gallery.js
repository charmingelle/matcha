import React from 'react';
// import AdvancedGridList from './../../components/AdvancedGridList/AdvancedGridList.js';

class GalleryImage extends React.Component {
  render() {
    return <img src={this.props.src} />
  }
}

class Gallery extends React.Component {
  render() {
    return (
      <div className="gallery">
        {/* {this.props.images.map((imgSrc, i) => (
          <img key={i} alt="" src={imgSrc} />
        ))} */}
        <GalleryImage src={this.props.images[0]} />
        <GalleryImage src={this.props.images[1]} />
        <GalleryImage src={this.props.images[2]} />
        <GalleryImage src={this.props.images[3]} />
        <GalleryImage src={this.props.images[4]} />
        {/* <AdvancedGridList /> */}
      </div>
    );
  }
}

export default Gallery;
