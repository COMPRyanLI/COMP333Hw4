// Importing necessary modules
import React, { useState, useEffect } from 'react';
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import AddSong from './add';
import UpdateSong from './update';
import DeleteSong from './delete';
import SearchSongs from './searchSong';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Stack = createStackNavigator();

// AddSong, UpdateSong, DeleteSong, and SearchSongs components need to be converted as well

function App() {
    // States and functions remain mostly the same
    const [songList, setSongList] = useState([]);
    const [editSong, setEditSong] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
        navigation.navigate('Login');
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
              navigation.navigate('View');
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
              navigation.navigate('View');}
            else{
              alert("The song already exists");
              navigation.navigate('AddSong');
      
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
            navigation.navigate('View');
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
      navigation.navigate('View');
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

    const LoginScreen = ({ navigation }) => {
        // Assume username, password, error, and handleLogin are available through context or props
    
        return (
            <View style={styles.formContainer}>
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
                <Button title="Login" onPress={handleLogin} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Button 
                    title="Don't have an account? Register"
                    onPress={() => navigation.navigate('Registration')}
                />
            </View>
        );
    };

    const RegistrationScreen = ({ navigation }) => {
        // Assume username, password, error, and handleRegistration are available
    
        return (
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
                <Button title="Register" onPress={handleRegistration} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Button 
                    title="Already have an account? Login"
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
        );
    };
    
    

    const AddSongScreen = () => (
        <AddSong onAddSong={handleAddSong} onCancel={() => navigation.goBack()} />
    );

    const UpdateSongScreen = () => (
        <UpdateSong song={editSong} onUpdate={handleEditSong} onCancel={() => navigation.goBack()} />
    );

    const DeleteSongScreen = () => (
        <DeleteSong song={editSong} onDeleteSong={handleDeleteSong} onCancel={() => navigation.goBack()} />
    );

    
    const ViewScreen = ({ navigation }) => {
            // Assuming songList is fetched from a state or context
            // If songList needs to be fetched inside this component, you can use useState and useEffect
        
            // Navigate to the add song screen
            const navigateToAddSong = () => {
                navigation.navigate('AddSong');
            };
        
            // Navigate to the update song screen
            const navigateToUpdateSong = (song) => {
                setEditSong(song); // Assuming setEditSong is available in the context or as a prop
                navigation.navigate('UpdateSong');
            };
        
            // Navigate to the delete song screen
            const navigateToDeleteSong = (song) => {
                setEditSong(song); // Assuming setEditSong is available in the context or as a prop
                navigation.navigate('DeleteSong');
            };

            const navigateToLogin = ()=> {
                setUsername(''); // log out
                setPassword('');
                navigation.navigate('Login');
            }
        
            // Render each song item
            const renderSongItem = ({ item }) => (
                <View style={styles.listItem}>
                    <Text style={styles.itemText}><Text style={styles.itemLabel}>Artist:</Text> {item.artist}</Text>
                    <Text style={styles.itemText}><Text style={styles.itemLabel}>Song:</Text> {item.song}</Text>
                    <Text style={styles.itemText}><Text style={styles.itemLabel}>Rating:</Text> {item.rating}</Text>
        
                    <View style={styles.buttonGroup}>
                        <FontAwesomeIcon 
                            icon={faEdit} 
                            size={24} 
                            onPress={() => navigateToUpdateSong(item)} 
                            style={styles.iconStyle}
                        />
                        <FontAwesomeIcon 
                            icon={faTrashAlt} 
                            size={24} 
                            onPress={() => navigateToDeleteSong(item)} 
                            style={styles.iconStyle}
                        />
                    </View>
                </View>
            );
        
            return (
                <View style={styles.container}> {/* using FlatList which has built-in scroll capability*/}
                    <FlatList  
                        data={songList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderSongItem}
                    />
                    <Button title="Add Song" onPress={navigateToAddSong} />
                    <Button title="Exit" onPress={navigateToLogin} /> {/* log out */}
                </View>
            );
        
        };

        const SearchSongsScreen = () => {
            return (
                <View style={styles.container}>
                    <SearchSongs songList={songList} onSearch={handleSearch} />
        
                    {searchResults.length > 0 && (
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.listItem}>
                                    <Text style={styles.itemText}>
                                        <Text style={styles.itemLabel}>Artist:</Text> {item.artist}
                                    </Text>
                                    <Text style={styles.itemText}>
                                        <Text style={styles.itemLabel}>Song:</Text> {item.song}
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            );
        };

    // UI Rendering
    return ( 
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">   {/* set the initial screen to login */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
                <Stack.Screen name="View" component={ViewScreen} />
                <Stack.Screen name="AddSong" component={AddSongScreen} />
                <Stack.Screen name="UpdateSong" component={UpdateSongScreen} />
                <Stack.Screen name="DeleteSong" component={DeleteSongScreen} />
                <Stack.Screen name="SearchSongs" component={SearchSongsScreen} />
               
            </Stack.Navigator>
        </NavigationContainer>
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
      },
      iconStyle: {
        color: '#000',
        margin: 5,
      }
 
}
);

export default App;
