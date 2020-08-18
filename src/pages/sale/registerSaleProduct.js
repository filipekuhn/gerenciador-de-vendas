import React, { Component } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker'
import { Button } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import styles from '../../stylesheet/stylesheet';
import ProductSale from '../../database/ProductSale';
import ProductSellingWay from '../../database/ProductSellingWay';

const ProductSaleDB = new ProductSale();
const ProductSellingWayDB = new ProductSellingWay();

export default class RegisterProductSale extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      selectedProduct: {},
      product: {},
      productSellingWays: [],
      idsale: '',
      salePrice: '',
      siteCommission: '',
      netPrice: ''
    }
  }

  componentDidMount() {
    this.getProduct();
    this.setState({ idsale: this.props.route.params.id });
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  getProduct() {
    let productSellingWays = [];
    ProductSellingWayDB.listProductsItems().then((data) => {
      productSellingWays = data;
      this.setState({
        productSellingWays,
        isLoading: false
      });
      console.log("OLHA AQUI CARAI: ", productSellingWays);
    }).catch((err) => {
      console.log(err);
    })
  }

  getValues(item) {
    this.setState({
      selectedProduct: item
    });

    let productValues = {};
    ProductSellingWayDB.findProductSellingWay(item).then((data) => {
      productValues = data;
      console.log("Tá aquiiiiiiiiiiii: ", productValues)
      this.setState({
        product: productValues,
        salePrice: productValues.saleprice,
        siteCommission: productValues.sitecommission,
        netPrice: productValues.netprice,
        isLoading: false        
      });
    })    
  }

  saveSaleProduct() {
    this.setState({
      isLoading: true,      
    });    
        
    let netPriceValue = this.salePriceField.getRawValue() - this.comissionField.getRawValue();
    netPriceValue = netPriceValue.toFixed(2);

    let data = {    
      idSale: this.state.idsale,        
      idProductSellingWay: this.state.selectedProduct,
      productPrice: this.salePriceField.getRawValue(),      
      netPrice: netPriceValue
    }
    console.log("AQUI O DATA DO PRODUCT SALE", data);
    ProductSaleDB.addProductSale(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Inclusão de Produto",
        "O produto foi incluído com sucesso!",
        [
          {
            text: "OK",             
            onPress: () => this.props.navigation.navigate('RegisterSale', {
              id: `${this.state.idSale}`,  
              productPrice: `${this.salePriceField.getRawValue()}`,
              netPrice: `${netPriceValue}`,                          
              add: true,
              update: false
            })
          }
        ],
        { cancelable: false }
      );      
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    });
  }  

  render() {
    return(
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
              
              <Text style={{ marginLeft: 20, marginTop: 10 }}>
                Selecione o Produto
              </Text>
              <Picker                                             
                style={{ width: 250, marginLeft: 15 }}
                selectedValue={this.state.selectedProduct}                              
                onValueChange={(itemValue, itemIndex, salePrice) =>
                  this.getValues(itemValue)
                }>            
                {
                  this.state.productSellingWays.map((item) => {
                    return <Picker.Item label={item.item} value={item.id} key={item.id} />                    
                  })                  
                }             
              </Picker>
              <Text style={{  marginLeft: 20 }}>Valor de Venda</Text>
              <TextInputMask       
                placeholder="R$ 0,00"         
                style={styles.textInput}
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}                
                value={this.state.salePrice}
                onChangeText={(text) => this.updateTextInput(text, 'salePrice')}                  
                ref={(ref) => this.salePriceField = ref}              
              />
              <Text style={{  marginLeft: 20 }}>Valor de Comissão do Site</Text>
              <TextInputMask                   
                placeholder="R$ 0,00"                             
                style={styles.textInput}
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}                
                value={this.state.siteCommission}
                onChangeText={(text) => this.updateTextInput(text, 'siteCommission')}                
                ref={(ref) => this.comissionField = ref}
              /> 
              {/* <Text style={{  marginLeft: 20 }}>Valor líquido</Text>
              <TextInputMask 
                placeholder="R$ 0,00"               
                style={styles.textInput}
                type={'money'}  
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}   
                value={this.state.netPrice}
                enabled={false}              
              />      */                 }
              <View style={{ marginLeft: 20}}>
                <Button
                  icon={{ name: 'save', color: '#FFF' }}                
                  title="Salvar"
                  buttonStyle={styles.button}                               
                  onPress={() => this.saveSaleProduct()}                
                /> 
              </View> 
            </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }  
}