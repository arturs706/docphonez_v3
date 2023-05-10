import React, { useState } from 'react';
import styles from './page.module.css';
import Loader from '@/app/Loader';


function Upploadimage() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [onSuccess, setOnSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    setFiles(files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      setLoading(true);
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/uploadimage', {
        method: 'POST',
        body: formData
      });
    
      const data = await response.json();
      setImageUrls(data.imageUrls);
      console.log(data.imageUrls)
      setLoading(false);
      setOnSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  } else if (onSuccess) {
    return <div>Success</div>;
  } else {
    return (
      <div>
        <form onSubmit={handleSubmit} className={styles.formsubmit}>
          <div
            className={dragging ? styles.dragging : styles.dropzone}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" multiple onChange={handleFileChange} />
            <p>Drag and drop your images here or click to select files.</p>
          </div>
          <button className={styles.uploadbutton} type="submit" >Upload</button>
        </form>
      </div>
    );
  }
}

export default Upploadimage;
