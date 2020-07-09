import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import databaseFileFormats from '../database/FileFormat';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//const db = new Database();
const db = new databaseFileFormats();


export default class FileFormats extends Component {  
  
  constructor(props) {
    super(props);
    this.state = {
      fileFormats: [],
      isLoading: true,
      notFound: 'Please click (+) button to add it.'      
    };    
  }

  componentDidMount() {
    /*this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getSellingWays();
    });*/
    this.getFileFormats();      
  }

  getFileFormats() {
    let fileFormats = [];
    db.listFileFormat().then((data) => {
      fileFormats = data;
      this.setState({
        fileFormats,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}      
      leftAvatar={{
        //source: item.prodImage && { uri: item.prodImage },
        title: item.name[0],        
      }}
      onPress={() => {
        this.props.navigation.navigate('FileFormat', {
          id: `${item._id}`                   
        });
      }}
      chevron
      bottomDivider
    />
    
  )

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.state.fileFormats.length === 0){
      return(
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>          
          <Button
            buttonStyle={styles.button}
            title="Adicionar Formatos de Arquivos"
            onPress={ () => this.props.navigation.navigate('RegisterFileFormat')} />
        </View>                  
      )
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.fileFormats}
        renderItem={this.renderItem}
      />
        <Button
          buttonStyle={styles.button}
          title="Cadastrar Formatos de Arquivos"
          onPress={ () => this.props.navigation.navigate('RegisterFileFormat')} />
      </SafeAreaView>
      
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    padding: 16,
    fontSize: 18,
    color: '#5390fe'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#5390fe',
    color: '#5390fe',
    padding: 10,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 10,
  },
});