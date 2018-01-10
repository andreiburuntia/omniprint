import React from 'react';
import { Picker, View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Button, Alert, TouchableOpacity, ScrollView, ListView, TouchableHighlight, Modal } from 'react-native';
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
      newJobName: '',
      newJobPaperSize: '',
      newJobColorOptions: '',
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
        var inputDate = new Date(child.val().date);
        var today = new Date();
        if(inputDate.setHours(0,0,0,0)==today.setHours(0,0,0,0))
          items.push({title: child.val().title, status: child.val().status, date: child.val().date});
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
          <Text style={item.status==='Finished' ? styles.finishedJob : item.status==="Failed" ? styles.failedJob : styles.inProgressJob}>{item.title} - {item.status}</Text>
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
          <View style={styles.modal}>
            <View style={styles.modalInner}>

              <Text style={styles.modalTitle}>Add a new print job</Text>

              <TextInput value={this.state.text}
                placeholder="Job name"
                onChangeText={(value)=>this.setState({newJobName:value})}/>

              <Picker
                onValueChange={(value) => this.setState({newJobColorOptions: value})}>
                <Picker.Item label="Monochrome" value="monochrome" />
                <Picker.Item label="Color" value="color" />
              </Picker>

              <Picker
                onValueChange={(value) => this.setState({newJobPaperSize: value})}>
                <Picker.Item label="A4" value="a4" />
                <Picker.Item label="Letter" value="letter" />
              </Picker>

              <View style={styles.modalBottomBuffer}/>

              <TouchableHighlight onPress={() => {
                this.itemsRef.push({title: this.state.text})
                this.setModalVisible(!this.state.modalVisible)                
                }}
                style={styles.modalOkBtn}>
                <Text style={styles.modalBtnText}>Done</Text>
              </TouchableHighlight>

              <TouchableHighlight onPress={() => {
                this.setModalVisible(!this.state.modalVisible)                
                }}
                style={styles.modalCancelBtn}>
                <Text style={styles.modalBtnText}>Cancel</Text>
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
    constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds,
    };

    this.itemsRef = this.getRef().child('printers');

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
          items.push({title: child.val().title, details: child.val().details, status: child.val().status});
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
          <Text style={item.status==='Online' ? styles.finishedJob : item.status==="Busy" ? styles.failedJob : styles.inProgressJob}>{item.title} - {item.status}</Text>
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
    modal: {
      marginTop: 22,
      flex: 1,
    },
    modalInner:{
      marginLeft: 20,
      marginRight: 20,      
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    modalTitle:{
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    modalBottomBuffer:{
      height: 80,
    },
    modalCancelBtn: {
      backgroundColor: '#e57373',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 120,
      height: 60,
      borderRadius: 80,
      marginRight: 10,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalOkBtn:{
      backgroundColor: '#4DB6AC',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 120,
      height: 50,
      borderRadius: 80,
      marginLeft: 10,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalBtnText: {
      fontSize: 20,
      textAlign: 'center'
    },
    finishedJob: {
      backgroundColor: '#A5D6A7',
      fontSize: 30,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 14,
      paddingBottom:16
    },
    failedJob: {
      backgroundColor: '#ef9a9a',
      fontSize: 30,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 14,
      paddingBottom:16
    },
    inProgressJob: {
      backgroundColor: '#81D4FA',
      fontSize: 30,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 14,
      paddingBottom:16
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
    }
  });

  export default MainScreenNavigator;
  