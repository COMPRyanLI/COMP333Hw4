import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// Update song component for the app
function UpdateSong({ song: initialSong, onUpdate, onCancel }) {
  const [song, setTitle] = useState(initialSong.song);
  const [artist, setArtist] = useState(initialSong.artist);
  const [rating, setRating] = useState(initialSong.rating.toString());

  const handleEditSong = () => {
    // Update the song object with the new properties
    const updatedSong = { ...initialSong, song, artist, rating: parseInt(rating) };
    if (rating < 0 || rating > 5) {
      alert('Rating should be between 0 and 5');
      return;
    }

    // Call the parent component's callback function to edit the song
    onUpdate(updatedSong);
  };

  // Handles cancel request
  const handleCancel = () => {
    onCancel();
  };

  return (
    <View>
      <Text>Edit Song</Text>
      <Text>
        Artist: {initialSong.artist}, Song Title: {initialSong.song}, Current Rating: {initialSong.rating}
      </Text>
      <View>
        <Text>New Title:</Text>
        <TextInput value={song} onChangeText={(text) => setTitle(text)} />
      </View>
      <View>
        <Text>New Artist:</Text>
        <TextInput value={artist} onChangeText={(text) => setArtist(text)} />
      </View>
      <View>
        <Text>New Rating:</Text>
        {/* Use a star icon for the rating input */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map((index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              color={index <= parseInt(rating) ? 'yellow' : 'gray'}
              onPress={() => setRating(index.toString())}
            />
          ))}
        </View>
      </View>
      <Button title="Update Song" onPress={handleEditSong} />
      <Button title="Cancel" onPress={handleCancel} />
    </View>
  );
}

export default UpdateSong;
