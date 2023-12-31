import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

// Update song component for the app
function UpdateSong({ song: initialSong, onUpdate, onCancel }) {
  const [song, setTitle] = useState(initialSong.song);
  const [artist, setArtist] = useState(initialSong.artist);
  const [rating, setRating] = useState(initialSong.rating.toString());
  const [ratingError, setRatingError] = useState('');

  // handles editing the song
  const handleEditSong = () => {
    const parsedRating = parseInt(rating);
    if (parsedRating < 0 || parsedRating > 5 || isNaN(parsedRating)) {
      setRatingError('Rating should be between 0 and 5');
      return;
    }

    // Sends updated song date back to parent
    const updatedSong = { ...initialSong, song, artist, rating: parsedRating };
    onUpdate(updatedSong);
  };

  // handles cancellation 
  const handleCancel = () => {
    onCancel();
  };

  return (
    <View style={styles.container}>
      <Text>Edit Song</Text>
      <Text>
        Artist: {initialSong.artist}, Song Title: {initialSong.song}, Current Rating: {initialSong.rating}
      </Text>
      <View style={styles.inputContainer}>
        <Text>New Title:</Text>
        <TextInput style={styles.input} value={song} onChangeText={(text) => setTitle(text)} />
      </View>
      <View style={styles.inputContainer}>
        <Text>New Artist:</Text>
        <TextInput style={styles.input} value={artist} onChangeText={(text) => setArtist(text)} />
      </View>
      <View style={styles.inputContainer}>
        <Text>New Rating:</Text>
        {/* ChatGPT assisted in this. Translates star input to equivalent rating */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity key={index} onPress={() => setRating(index)}>  
            <FontAwesomeIcon
              key={index}
              icon={faStar}
              color={index <= parseInt(rating) ? 'yellow' : 'gray'} // Highlights icons based on selected rating
              />
          </TouchableOpacity>
          ))}
        </View>
        {ratingError ? <Text style={styles.errorText}>{ratingError}</Text> : null}
      </View>
      <Button title="Update Song" onPress={handleEditSong} />
      <Button title="Cancel" onPress={handleCancel} />
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
  },
});

export default UpdateSong;

