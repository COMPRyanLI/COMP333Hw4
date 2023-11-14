import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// AddSong component for the app
function AddSong({ onAddSong, onCancel }) {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [rating, setRating] = useState('');

  const handleAddSong = () => {
    // Check if the rating is valid
    if (rating < 0 || rating > 5) {
      alert('Rating should be between 0 and 5');
      return;
    }

    // Create a new song object with the input values
    const newSong = {
      artist,
      song,
      rating: parseInt(rating),
    };

    // Call the parent component's callback function to add the new song
    onAddSong(newSong);

    // Reset the form fields
    setArtist('');
    setSong('');
    setRating('');
  };

  // Handles cancel request
  const handleCancel = () => {
    onCancel();
  };

  return (
    <View>
      <Text>Add New Song Rating</Text>
      <View>
        <Text>Artist:</Text>
        <TextInput value={artist} onChangeText={(text) => setArtist(text)} />
      </View>
      <View>
        <Text>Song:</Text>
        <TextInput value={song} onChangeText={(text) => setSong(text)} />
      </View>
      <View>
        <Text>Rating:</Text>
        {/* Use a star icon for the rating input */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map((index) => (
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              color={index <= rating ? 'yellow' : 'gray'}
              onPress={() => setRating(index.toString())}
            />
          ))}
        </View>
      </View>
      <Button title="Add Song" onPress={handleAddSong} />
      <Button title="Cancel" onPress={handleCancel} />
    </View>
  );
}

export default AddSong;

