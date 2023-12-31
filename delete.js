import React from 'react';
import { View, Text, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// Delete function 
function DeleteSong({ song, onDeleteSong, onCancel }) {
  const handleDeleteSong = () => {
    // Send the song ID to the parent for deletion
    onDeleteSong(song.id);
  };

  // Handles cancel request
  const handleCancel = () => {
    onCancel();
  };

  return (
    <View>
      <Text>Delete Song</Text>
      <Text>
        Are you sure you want to delete this song?
      </Text>
      <Text>
        {/* ChatGPT assisted in this. Deletes song from the song list */}
        {[...Array(song.rating)].map((_, index) => (
          <FontAwesomeIcon key={index} icon={faStar} color="yellow" />
        ))}
      </Text>
      <Button title="Delete" onPress={handleDeleteSong} />
      <Button title="Cancel" onPress={handleCancel} />
    </View>
  );
}

export default DeleteSong;
