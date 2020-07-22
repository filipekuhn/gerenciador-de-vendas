import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Alert, FlatList, ListItem, ListView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Database from '../../database/Product';
import ProductSellingWay from '../../database/ProductSellingWay';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../stylesheet/stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';

const db = new Database();
const dbProductSellingWay = new ProductSellingWay();

export default class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      product: {},
      id: '',  
      productSellingWays: []    
    };      
  }
  

 componentDidMount() {
      this.getProduct();
  }

  getProduct() {
    let product = {};     
    let productSellingWays = [];
    const { id } = this.props.route.params;    
    db.findProductById(id).then((data) => {      
      product = data;      
      this.setState({
        product,        
        id: product._id
      });            
      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });
    dbProductSellingWay.listProductSellingWay(id).then((data) => {
      productSellingWays = data;    
      this.setState({
        productSellingWays,
        isLoading: false
      });
      console.log("AQUI ", productSellingWays);
    });  
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem      
      title={item.siteinclusiondate}
      //subtitle={item.netprice}
      leftAvatar={{        
        rounded: true,
        showEditButton: true,
        size: "medium",
        //source: { uri: 'https://reactjs.org/logo-og.png'},        
        source: require('../../images/product.png'),         
      }}
      onPress={() => {
        this.props.navigation.navigate('Product', {
          id: `${item._id}`                   
        });
      }}
      chevron
      bottomDivider
    />
    
  )  

  render() {    
    if(this.state.isLoading){
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.props.route.params.update){
      this.props.route.params.update = false;
      this.getProduct();
    }
    return (
      <ScrollView>              
        <Card>          
          <View>  
            <Text>Produto: {this.state.product.name}</Text>
          </View>
          <View>  
            <Text>Código: {this.state.product.code}</Text>
          </View>    
          <View>  
            <Text>Medidas: {this.state.product.measures}</Text>
          </View>          
          <Button
            buttonStyle={styles.button}
            icon={{name: 'edit', color: '#FFF'}}
            title='Editar'
            onPress={() => this.props.navigation.navigate('EditProduct', {
              id: `${this.state.id}`
            }) } />

          <Button
            buttonStyle={styles.deleteButton}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'
            onPress={() => Alert.alert(
              "Exclusão de Usuário",
              `Você tem certeza que deseja excluir o produto ${this.state.product.name}?`,
              [
                {
                  text: "Sim", 
                  onPress: () => db.deleteProductById(this.state.id).then(() => this.props.navigation.navigate('Products', {
                    update: true
                  })), 
                  icon: "done"
                },
                {
                  text: "Cancelar",                   
                }
              ],
              { cancelable: true }
            )}
            />   
            <Button
              icon={{name: 'add-circle-outline', color: '#FFF'}}                
              title="Incluir Valores"
              buttonStyle={styles.button}
              onPress={() => this.props.navigation.navigate('RegisterProductSellingWay', {
                id: `${this.state.id}`,
                name: `${this.state.product.name}`
              })}
            />    
        </Card>        
      </ScrollView>
    )
  } 
}