// Importing necessary modules
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import AddSong from './addSong';
import UpdateSong from './edit';
import DeleteSong from './delete';
import SearchSongs from './searchSong';
import axios from 'axios';

// AddSong, UpdateSong, DeleteSong, and SearchSongs components need to be converted as well

function App() {
    // States and functions remain mostly the same
    const [feature, setFeature] = useState('view');
    const [songList, setSongList] = useState([]);
    const [editSong, setEditSong] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false); // Manage registration form visibility
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        axios
        .get('http://localhost/index.php/user/view')
        .then((res) => {
          setSongList(res.data); // Update state with fetched data
        })
        .catch((error) => {
          console.error('Error fetching songs:', error);
        });
    }, []);

    // Event handlers
    const handleRegistration = async (event) => {
        event.preventDefault();
    if (!username || !password || password.length < 10) {
      setError('Please provide a valid username and a password with more than 10 characters.');
      return;
    }
    try {
      // Send a POST request to register the user. Updates states as needed
      const response = await axios.post('http://localhost/index.php/user/create', { username, password });
      if (response.status < 300 && response.data === true) {
        setError('');
        setIsLoggedIn(false);
        setShowRegistration(false);
        setFeature('view');
        setUsername('');
        setPassword('');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    }
    };

    const handleLogin = async (event) => {
        if (!username || !password) {
            setError('Please provide a valid username and password.');
            return;
          }
          event.preventDefault();
          try {
            // POST request. Updates states accordingly if successful 
            const response = await axios.post('http://localhost/index.php/user/check', { username, password });
            if (response.status < 300 && response.data === true) {
              setError('');
              setIsLoggedIn(true);
              setFeature('view');
            } else {
              setError('Invalid username or password.');
            }
          } catch (error) {
            setError('Network error. Please check your connection and try again.');
          }
    };

    const handleAddSong = (newSong) => {
        if (!newSong.artist || !newSong.song || !newSong.rating || newSong.rating < 1 || newSong.rating > 5) {
            setError('Please fill out all fields and provide a rating between 1 and 5.');
            return;
          }  
          axios.post('http://localhost/index.php/user/add', {
            ...newSong,
            username: username
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          // update states with new values
          .then((response) => {
            if (response.data!=="false"){
              const data_new = response.data; 
              setSongList(data_new);
              setFeature('view');}
            else{
              alert("The song already exists");
              setFeature('add');
      
            }
            
          })
          .catch((error) => {
            console.error('Error adding song:', error);
          });
    };

    const handleEditSong = (editedSong) => {
        if (!editedSong.artist || !editedSong.song || !editedSong.rating || editedSong.rating < 1 || editedSong.rating > 5) {
            setError('Please fill out all fields and provide a rating between 1 and 5.');
            return;
          }
          axios.post(`http://localhost/index.php/user/update`, editedSong, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          // update states accordingly
          .then(() => {
            const updatedSongList = songList.map((song) =>
              song.id === editedSong.id ? editedSong : song
            );
            setSongList(updatedSongList);
            setFeature('view');
            setEditSong(null);
          })
          .catch((error) => {
            console.error('Error editing song:', error);
          });
    };

    const handleDeleteSong = (songId) => {
        axios.post('http://localhost/index.php/user/delete', { id: songId }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // update states accordingly
    .then(() => {
      const updatedSongList = songList.filter((song) => song.id !== songId);
      setSongList(updatedSongList);
      setFeature('view');
    })
    .catch((error) => {
      console.error('Error deleting song:', error);
    });
    };

    const handleSearch = (results) => {
        if (results === '') {
            alert("Nothing found");
            return;
          }
          setSearchResults(results);
    };

    // UI Rendering
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Song Rating App</Text>
            {!isLoggedIn ? (
                <View style={styles.formContainer}>
                    {showRegistration ? (
                       <View style={styles.formContainer}>
                       <Text style={styles.formHeader}>Register</Text>
                       
                       <View style={styles.inputGroup}>
                           <Text style={styles.label}>Username:</Text>
                           <TextInput
                               style={styles.input}
                               value={username}
                               onChangeText={setUsername}
                               placeholder="Enter your username"
                           />
                       </View>
                   
                       <View style={styles.inputGroup}>
                           <Text style={styles.label}>Password:</Text>
                           <TextInput
                               style={styles.input}
                               value={password}
                               onChangeText={setPassword}
                               placeholder="Enter your password"
                               secureTextEntry={true}
                           />
                       </View>
                   
                       <Button 
                           title="Register" 
                           onPress={handleRegistration} 
                       />
                   
                       {error ? <Text style={styles.errorText}>{error}</Text> : null}
                   </View>
                   
                    ) : (
                        <View style ={styles.formcontainer}>
                            <Text style={styles.formHeader}>Login</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Username:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Enter your username"
                                />
                            </View>
                   
                       <View style={styles.inputGroup}>
                           <Text style={styles.label}>Password:</Text>
                           <TextInput
                               style={styles.input}
                               value={password}
                               onChangeText={setPassword}
                               placeholder="Enter your password"
                               secureTextEntry={true}
                           />
                       </View>
                   
                       <Button 
                           title="Register" 
                           onPress={handleLogin} 
                       />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        
                        </View>
                    )}
                </View>
            ) : (
                <View>
                    <SearchSongs songList={songList} onSearch={handleSearch} />
    
    {searchResults.length > 0 && (
        <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.listItem}>
            <Text style={styles.itemText}><Text style={styles.itemLabel}>Artist:</Text> {item.artist}</Text>
            <Text style={styles.itemText}><Text style={styles.itemLabel}>Song:</Text> {item.song}</Text>
            </View>
        )}
        />
    )}

    {feature === 'view' && (
        <View>
        <FlatList
            data={songList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View style={styles.listItem}>
                <Text style={styles.itemText}><Text style={styles.itemLabel}>Artist:</Text> {item.artist}</Text>
                <Text style={styles.itemText}><Text style={styles.itemLabel}>Song:</Text> {item.song}</Text>
                <Text style={styles.itemText}><Text style={styles.itemLabel}>Rating:</Text> {item.rating}</Text>
                
                {username === item.username && (
                <View style={styles.buttonGroup}>
                    <Button title="Edit" onPress={() => { setFeature('edit'); setEditSong(item); }} />
                    <Button title="Delete" onPress={() => { setFeature('delete'); setEditSong(item); }} />
                </View>
                )}
            </View>
            )}
        />
        <Button title="Add Song" onPress={() => setFeature('add')} />
        <Button title="Log out" onPress={() => setIsLoggedIn(false)} />
        </View>
    )}

        {feature === 'add' && songList && (
            <AddSong onAddSong={handleAddSong} onCancel={() => setFeature('view')} />
        )}
    
        {feature === 'edit' && editSong && (
            <UpdateSong song={editSong} onUpdate={handleEditSong} onCancel={() => setFeature('view')} />
        )}

        {feature === 'delete' && editSong && (
            <DeleteSong song={editSong} onDeleteSong={handleDeleteSong} onCancel={() => setFeature('view')} />
        )}
    </View>
                )}
            </ScrollView>
        );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    formContainer: {
        // Container for the whole form
        padding: 20,
        marginTop: 20,
    },
    formHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      itemText: {
        fontSize: 16,
        marginBottom: 5,
      },
      itemLabel: {
        fontWeight: 'bold',
      },
      buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      }
 
});

export default App;
