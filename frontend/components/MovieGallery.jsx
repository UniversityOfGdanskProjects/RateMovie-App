import React, { useEffect, useState } from "react";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function MovieGallery({ movie }) {
  const [images, setImages] = useState(null);

  useEffect(() => {
    if (movie.images) {
      const newImages = movie.images.map((image) => ({
        original: image,
      }));
      setImages(newImages);
    }
  }, [movie]);

  return (
    <div className="movie-gallery px-12">
      <h2 className="pb-4">Gallery</h2>
      {images ? <Gallery items={images} /> : <p>No images available</p>}
    </div>
  );
}
