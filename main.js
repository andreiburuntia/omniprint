import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Button, Alert, TouchableOpacity, ScrollView, ListView, TouchableHighlight, Modal } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyCGpaxJscyQ3pWqk-6IZcDsuybNjwfKCw4",
  authDomain: "omniprint-c6d69.firebaseapp.com",
  databaseURL: "https://omniprint-c6d69.firebaseio.com",
  projectId: "omniprint-c6d69",
  storageBucket: "omniprint-c6d69.appspot.com",
  messagingSenderId: "92566672982"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

class JobsScreen extends React.Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      text: '',
      modalVisible: false,
      dataSource: ds,
    };

    this.itemsRef = this.getRef().child('items');

    this.renderRow = this.renderRow.bind(this);
    this.pressRow = this.pressRow.bind(this);
  }

  getRef(){
    return firebaseApp.database().ref();
  }

  componentWillMount(){
    this.getItems(this.itemsRef);
  }

  componentDidMount(){
    this.getItems(this.itemsRef);
  }

  getItems(itemsRef){
    itemsRef.on('value', (snap)=>{
      let items=[];
      snap.forEach((child) => {
        items.push(child.val().title);
      });
      console.log(items);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      })
    });    
  }

  renderRow(item){
    return (
      <TouchableHighlight onPress={()=>this.pressRow(item)}>
        <View style={styles.li}>
          <Text style={styles.liItem}>{item}</Text>
          </View>
      </TouchableHighlight>
    )
  }

  pressRow(item){
    console.log("PRESSED: "+item);
  }

  setModalVisible(visible){
    this.setState({modalVisible:visible});
  }

  addItem(){
    this.setModalVisible(true);
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
          >
          <View style={{marginTop: 22}}>
            <View>
              <Text>Hello world!</Text>
              <TextInput value={this.state.text}
                placeholder="Enter text"
                onChangeText={(value)=>this.setState({text:value})}/>
              <TouchableHighlight onPress={() => {
                this.itemsRef.push({title: this.state.text})
                this.setModalVisible(!this.state.modalVisible)                
                }}>
                <Text>Done</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => {
                this.setModalVisible(!this.state.modalVisible)                
                }}>
                <Text>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
        <TouchableOpacity style={styles.addBtn} onPress={this.addItem.bind(this)}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
  }
  
  class PrintersScreen extends React.Component {
    render() {
      return <Text>List of all printers</Text>
    }
  }
  
  const MainScreenNavigator = TabNavigator({
    Jobs: { screen: JobsScreen },
    Printers: { screen: PrintersScreen },
  },{
    tabBarPosition: 'top',
    tabBarOptions: {
      style: {
        backgroundColor: '#34495e'
      }
    }
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {

    },
    addBtn: {
      position: 'absolute',
      zIndex: 11,
      right: 30,
      bottom: 50,
      backgroundColor: '#f1c40f',
      width: 60,
      height: 60,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
    },
    addBtnText: {
      color: 'white',
      fontSize: 24,
    },
    li: {
      borderBottomColor: '#eee',
      borderColor: 'transparent',
      borderWidth: 1,
      paddingLeft: 16,
      paddingTop: 14,
      paddingBottom:16
    }
  });

  export default MainScreenNavigator;
  