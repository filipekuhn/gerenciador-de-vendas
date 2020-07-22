import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import { Card, Button, ListItem } from 'react-native-elements';
import Database from '../../database/Product';
import ProductSellingWay from '../../database/ProductSellingWay';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../stylesheet/stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';

const db = new Database();
const dbProductSellingWay = new ProductSellingWay();
const list = [
  {
    name: 'Vai te fude',
    subtitle: 'Seu bosta'
  }
]

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
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
              Valores do Produto
            </Text>
          </View>
          <View>
            {
              this.state.productSellingWays?.map((l, i) => (
                <ListItem                  
                  key={i}
                  title={l.sellingWay.name}
                  subtitle={"Valor de Venda: " + l.saleprice + "\nComissão do Site: " + l.sitecommission + "\nValor Líquido: " + l.netprice}
                  onLongPress={() => dbProductSellingWay.deleteProductSellingWay(l._id)}
                  topDivider
                  bottomDivider
                />
              ))
            }
          </View>        



        </Card>    
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
      </ScrollView>
    )
  } 
}