import React, { useState } from 'react';
import { View, Text, TextInput, Button,TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// AddSong component for the app
function AddSong({ onAddSong, onCancel }) {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [rating, setRating] = useState(0); // Initialize rating as 0

  // Handles adding a new song
  const handleAddSong = () => {
    // Create a new song object with the input values
    const newSong = {
      artist,
      song,
      rating,
    };

    // Call the parent component's callback function to add the new song
    onAddSong(newSong);

    // Reset the form fields
    setArtist('');
    setSong('');
    setRating(0);
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
        {/* Display star icons for rating selection */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((index) => (
              <TouchableOpacity key={index} onPress={() => setRating(index)}>
                <FontAwesomeIcon
                  icon={faStar}
                  color={index <= rating ? 'yellow' : 'gray'} // Highlight icons based on selected rating
                />
              </TouchableOpacity>
            ))}
          </View>
      </View>
      <Button title="Add Song" onPress={handleAddSong} />
      <Button title="Cancel" onPress={handleCancel} />
    </View>
  );
}

export default AddSong;

