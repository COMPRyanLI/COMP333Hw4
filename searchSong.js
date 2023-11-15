import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

// Search song component for React Native
const SearchSongs = ({ songList, onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchInput = () => {
    // Use the searchInput state variable to filter the songs
    const filtered = songList.filter((song) =>
      song.artist.toLowerCase().includes(searchInput.toLowerCase())
    );
    
    // Pass the filtered list back to the parent component
    onSearch(filtered); 
  };

  return (
    <View>
      <Text>Artist:</Text>
      <TextInput
        placeholder="Enter artist name"
        value={searchInput}
        onChangeText={(text) => setSearchInput(text)}
      />
      <Button title="Search" onPress={handleSearchInput} />
    </View>
  );
};

export default SearchSongs;
