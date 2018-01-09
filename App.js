import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Button, Alert } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MainScreenNavigator from './main';

const HomeScreen = ({ navigation }) => (
  <KeyboardAvoidingView behavior="padding" style={styles.container}>
    <View style={styles.logoContainer}>
        <Text style={styles.title}>omniPrint</Text>
        <Text style={styles.version}>version 0.1</Text>
    </View>
    <View>
        <View style={styles.formContainer}>
            <TextInput underlineColorAndroid='transparent' placeholder="email" returnKeyType="next" 
            onSubmitEditing={() => this.passwordInput.focus()} 
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(username) => state.username=username}
            style={styles.input}/>

            <TextInput underlineColorAndroid='transparent' placeholder="password" returnKeyType="go" secureTextEntry 
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(password) => state.password=password}
            ref={(input) => this.passwordInput = input}/>

            <Button 
            onPress={() => {
              if(_userLogin()) 
                navigation.navigate('Details')
              else
                Alert.alert("Invalid credentials!");
              }
            }
            title="Submit"
            color="#f1c40f"
            />
        </View>
    </View>

  </KeyboardAvoidingView>
);



state = {
  username: '',
  password: '',
  isLoggingIn: false,
  message: ''
}

_userLogin = function (navi){
  return true;
  if(state.username==="buru" && state.password==="root"){
    return true;
  }
  return false;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50'
  },
  formContainer: {
      padding: 30
  },
  input: {
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginBottom: 10,
      color: 'white',
      paddingHorizontal: 15
  },
  buttonText: {
      textAlign: 'center',
      color: 'white'
  },
  title: {
      color: 'white',
      fontSize: 40,
      fontWeight: 'bold'
  },
  version: {
      color: 'white',
      fontSize: 9,
      fontWeight: 'bold'
  },
  logoContainer: {
      marginTop: 100,
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center'
  }
});

const Main = () => (
  <MainScreenNavigator/>
);

const RootNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
      headerTitle: 'Login'
    },
  },
  Details: {
    screen: Main,
    navigationOptions: {
      header: null,
      headerTitle: 'Main'
    },
  },
});

export default RootNavigator;
