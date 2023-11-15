// Importing necessary modules
import React, { useState, useEffect } from 'react';
import "react-native-gesture-handler";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet,FlatList } from 'react-native';
import AddSong from './add';
import UpdateSong from './edit';
import DeleteSong from './delete';
import SearchSongs from './searchSong';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // two icons for delete and edit


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

    // use fetch to interact with Rest API
    useEffect(() => {
        fetch('http://10.0.2.2/index.php/user/view/data.json', {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                setSongList(data); // Update state with fetched data
            })
            .catch((error) => {
                console.error('Error fetching songs:', error);
            });
    }, []);

    // Event handlers
    


    const LoginScreen = ({ navigation }) => {

        // Assume username, password, error, and handleLogin are available through context or props
        const handleLogin = async (event) => {
            if (!username || !password) {
                setError('Please provide a valid username and password.');
                return;
            }
            event.preventDefault();
    //10.0.2.2 is the address of the local host
            fetch('http://10.0.2.2/index.php/user/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data === true) {
                        setError('');
                        navigation.navigate('View');
                    } else {
                        setError('Invalid username or password.');
                    }
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    setError('Network error. Please check your connection and try again.');
                });
        }

        return (
            <View style={styles.formContainer}>
                <Text style={styles.formHeader}>Login</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username:</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={(text)=>setUsername(text)}
                        placeholder="Enter your username"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={(text)=> setPassword(text)}
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
        const handleRegistration = async () => {
            if (!username || !password || password.length < 10) {
                setError('Please provide a password with more than 10 digits.');
                return;
            }
           // 10.0.2.2 is the address of localhost
                fetch('http://10.0.2.2/index.php/user/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, password}),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data === true) {
                    setError('');
                    // Make sure navigation is defined and is a function before calling it
                    
                    navigation.navigate('Login');
                    
                    setUsername('');
                    setPassword('');
                } else {
                    setError('Registration failed. Please try again.');
                }
            }) .catch((error) => {
                console.error('Registration error:', error);
                setError('Network error. Please check your connection and try again.');
            })
        };
        
        

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



    const AddSongScreen = ({navigation}) => {
        const handleAddSong = (newSong) => {
            if (!newSong.artist || !newSong.song || !newSong.rating || newSong.rating < 1 || newSong.rating > 5) {
                setError('Please fill out all fields and provide a rating between 1 and 5.');
                alert(error);
                return;
            }
            fetch('http://10.0.2.2/index.php/user/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newSong,
                    username: username
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data !== "false") {
                        setSongList(data);
                        navigation.navigate('View');
                    } else {
                        alert("The song already exists");
                        navigation.navigate('AddSong');
                    }
                })
                .catch((error) => {
                    console.error('Error adding song:', error);
                });
        };
        
        return( 
            <View style={styles.container}>
            <Text>Current User: {username}</Text>
            <AddSong onAddSong={handleAddSong} onCancel={() => navigation.goBack()} />
            </View>


        );
};

    const UpdateSongScreen = ({navigation}) => {
        const handleEditSong = (editedSong) => {
            if (!editedSong.artist || !editedSong.song || !editedSong.rating || editedSong.rating < 1 || editedSong.rating > 5) {
                setError('Please fill out all fields and provide a rating between 1 and 5.');
                return;
            }
        
            fetch('http://10.0.2.2/index.php/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedSong),
            })
            .then((response) => {
                if (!response.ok) {
                    // If the HTTP status code is not OK, throw an error.
                    throw new Error('Network response was not ok.');
                }
                return response.text();  // or response.json() if your server responds with empty body for successful POST requests
            })
            .then((text) => {
                // Safely handle a scenario where the server responds with an empty body
                try {
                    return JSON.parse(text);
                } catch {
                    // If JSON.parse fails, return a default value or handle accordingly
                    return {};
                }
            })
            .then((data) => {
                // Handle your data here
                const updatedSongList = songList.map((song) =>
                    song.id === editedSong.id ? editedSong : song
                );
                setSongList(updatedSongList);
                navigation.navigate('View');
                setEditSong(null);
            })
            .catch((error) => {
                console.error('Error editing song:', error);
                setError('An error occurred while updating the song.');
            });
        };
        
    
       return ( 
        <View style={styles.container}>
        <Text>Current User: {username}</Text>
       <UpdateSong song={editSong} onUpdate={handleEditSong} onCancel={() => navigation.goBack()} />
       </View>);

};

    const DeleteSongScreen = ({navigation}) => {
        const handleDeleteSong = (songId) => {
            fetch('http://10.0.2.2/index.php/user/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: songId }),
            })
                .then((response) => response.json())
                .then(() => {
                    const updatedSongList = songList.filter((song) => song.id !== songId);
                    setSongList(updatedSongList);
                    navigation.navigate('View');
                })
                .catch((error) => {
                    console.error('Error deleting song:', error);
                });
        };
    
        return (
            <View style={styles.container}>
            <Text>Current User: {username}</Text>
            <DeleteSong song={editSong} onDeleteSong={handleDeleteSong} onCancel={() => navigation.goBack()} />
            </View>);
};

// This part is completed with the help of GPT
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
        
        const navigateToSearchSong = () =>{
            setSearchResults('');
            navigation.navigate('SearchSongs');
        }

        const navigateToLogin = () => {
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

                {username === item.username && (
                <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={() => navigateToUpdateSong(item)}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    size={24}
                    style={styles.iconStyle}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToDeleteSong(item)}>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    size={24}
                    style={styles.iconStyle}
                  />
                </TouchableOpacity>
              </View>)}
            </View>
        );
// always display the user status(username)
        return (
            <View style={styles.container}>
                <Text>Current User: {username}</Text>
                <FlatList
                    data={songList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderSongItem}
                />
                <Button title="Add Song" onPress={navigateToAddSong} />
                <Button title="Search" onPress={navigateToSearchSong} />
                <Button title="Exit" onPress={navigateToLogin} />
                
            </View>
        );

    };

    const SearchSongsScreen = () => {
        const handleSearch = (results) => {
            if (results === '') {
                alert("Nothing found");
                return;
            }
            setSearchResults(results);
        };
        return (
            <View style={styles.container}>
                <Text>Current User: {username}</Text>
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

    // UI Rendering using navigator, passing username and other props to each screen
    return (
        <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen 
            name="View" 
            children={(props) => <ViewScreen {...props} username={username} />} 
        />
        <Stack.Screen 
            name="AddSong" 
            children={(props) => <AddSongScreen {...props} username={username} />} 
        />
        <Stack.Screen 
            name="UpdateSong" 
            children={(props) => <UpdateSongScreen {...props} username={username} />} 
        />
        <Stack.Screen 
            name="DeleteSong" 
            children={(props) => <DeleteSongScreen  {...props} username={username} />} 
        />
        <Stack.Screen 
            name="SearchSongs" 
            children={(props) => <SearchSongsScreen {...props} username={username} />} 
        />
    </Stack.Navigator>
</NavigationContainer>

    );
}
// the stylesheet is completed with the help of GPT
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
