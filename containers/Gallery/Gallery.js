import React from 'react';

class Gallery extends React.Component {
  render() {
    return (
      <div className="gallery">
        {this.props.images.map((imgSrc, i) => (
          <img key={i} alt="" src={imgSrc} />
        ))}
      </div>
    );
  }
}

export default Gallery;
