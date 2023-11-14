import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// Delete component for App.js
function DeleteSong({ song, onDeleteSong, onCancel }) {
  const handleDeleteSong = () => {
    // Send the song ID to the parent component (App.js) for deletion
    onDeleteSong(song.id);
  };

  // handles cancel request
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <h2>Delete Song</h2>
      <p>
        Are you sure you want to delete the song 
        {[...Array(song.rating)].map((_, index) => (
          <FontAwesomeIcon key={index} icon={faStar} color="yellow" />
        ))}
      </p>
      <button onClick={handleDeleteSong}>Delete</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default DeleteSong;