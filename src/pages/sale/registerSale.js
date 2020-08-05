import React, { Component } from 'react';
import { View, FlatList, Image, KeyboardAvoidingView, Alert, Text, Picker, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../stylesheet/stylesheet';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';
import SaleDb from '../../database/Sale';
import CustomerDb from '../../database/Customer';
import ProductDb from '../../database/Product';
import ProductSaleDb from '../../database/ProductSale';
import SellingWayDb from '../../database/SellingWay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputMask } from 'react-native-masked-text';

const Colors = {
  primary: '#078489',
  secondary: '#124b5f',
  tertiary: '#f7f1e3',
}

const Sale = new SaleDb();
const Customer = new CustomerDb();
const Product = new ProductDb();
const ProductSale = new ProductSaleDb();
const SellingWay = new SellingWayDb();


export default class RegisterSale extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      isLoading: true,
      id: '',
      date: '',       
      idcustomer: '', 
      idsellingway: '', 
      observations: '', 
      saleprice: '', 
      finalprice: '', 
      amountpaid: '',
      pendingpayment: '',                  
      selectedCustomer: {},
      selectedSellingWay: {},
      selectedProduct: {},
      productSale: [],
      sellingWays: [],
      customers: [],
      productNotFound: 'Nenhum produto foi adicionado'
    };          
  }

  componentDidMount() {  
    let todayDate = moment(new Date()).format("DD-MM-YYYY");
    this.setState({
      date: todayDate
    });  
    this.getCustomers();
    this.getSellingWays();
    //this.getProducts();
  }

  getCustomers() {
    let customers = [];
    Customer.listCustomerItems().then((data) => {
      customers = data;      
      this.setState({
        customers,        
        isLoading: false,
      });      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  getSellingWays() {
    let sellingWays = [];
    SellingWay.listSellingWaysItems().then((data) => {
      sellingWays = data;      
      this.setState({
        sellingWays,                
        isLoading: false,
      });      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  getProductSale() {
    let productSale = [];
    ProductSale.listProductSale(this.state.id).then((data) => {
      productSale = data;
      this.setState({
        productSale,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })

  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveSale() {      
    this.setState({
      isLoading: true,      
    });          

    let pending = true;
    let pendigPaymentValue = this.amountPaidField.getRawValue() - this.salePriceField.getRawValue()
    pendigPaymentValue = pendigPaymentValue.toFixed(2)

    if( pendigPaymentValue >= 0) {
      pending = false
    }
    
    let finalPrice = this.finalPriceField.getRawValue();
    let salePrice = this.salePriceField.getRawValue();
    let amountPaid = this.amountPaidField.getRawValue();
    let date = null ;

    if(this.state.saleprice === '') {
      salePrice = null;
    }

    if(this.state.finalprice === '') {
      finalPrice = null;
    }
    
    if(this.state.amountpaid === '') {
      amountPaid = null;
    }

    if(this.state.date !== '') {
      date = this.state.date
    }

    if(!this.dateField.isValid()){    
      Alert.alert(
        "ERRO",
        "A data inserida como data de venda é inválida!",
        [
          {
            text: "OK"
          }
        ],
        { cancelable: true }
      )
      return false
    }

      let data = {      
      date: date,       
      idcustomer: this.state.selectedCustomer, 
      idsellingway: this.state.selectedSellingWay, 
      observations: this.state.observations, 
      saleprice: salePrice, 
      finalprice: finalPrice, 
      amountpaid: amountPaid,
      pendingpayment: pending
    }

    Sale.addSale(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      if(result) {
        Alert.alert(
          "Cadastro de Venda",
          "O Cadastro foi salvo com sucesso!",
          [
            {
              text: "OK", 
              onPress: () => this.props.navigation.navigate('Sales', { update: true }),              
            }
          ],
          { cancelable: false }
        );
      }      
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Venda",
        "Não foi possível realizar o cadastro!\nVerifique se todos os campos foram preenchidos e se a data é válida!",
        [
          {
            text: "OK", 
            onPress: () => this.props.navigation.navigate('RegisterSale'),               
          }
        ],
        { cancelable: false }
      );
    });
  }

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getProductSale() });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem                        
      title={item.product.name}
      titleStyle={{ fontWeight: "bold", fontSize: 18 }}                                     
      subtitle={
        <View>
          <View style={{ flexDirection: 'row'}}>
            <Text style={{ fontWeight: 'bold'}}>Valor de Venda: </Text>
            <TextMask
            value={item.saleprice}
            type={'money'}
            options={{
                obfuscated: true,
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ ',
                suffixUnit: ''
            }}
            />
          </View>
          <View style={{ flexDirection: 'row'}}>
            <Text style={{ fontWeight: 'bold'}}>Comissão do Site: </Text>
            <TextMask
            value={item.sitecommission}
            type={'money'}
            options={{
                obfuscated: true,
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ ',
                suffixUnit: ''
            }}
            />
          </View>
          <View style={{ flexDirection: 'row'}}>
            <Text style={{ fontWeight: 'bold'}}>Valor Líquido: </Text>
            <TextMask
            value={item.netprice}
            type={'money'}
            options={{
                obfuscated: true,
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ ',
                suffixUnit: ''
            }}
            />
          </View>
        </View>
      }
      rightAvatar={{
        icon: { name: 'delete', color: 'red'}                     
      }}
      onPress={() => this.props.navigation.navigate('EditProductSale', {
        id: `${item._id}`
      })}                  
      onLongPress={() => Alert.alert(
        "Exclusão Produto",
        `Você tem certeza que deseja excluir dessa venda o Produto ${item.sellingWay.name}?`,
        [
          {
            text: "Sim", 
            onPress: () => dbProductSellingWay.deleteProductSellingWay(`${item._id}`).then(() => this.onRefresh()),                         
          },
          {
            text: "Cancelar",                   
          }
        ],
        { cancelable: true }
      )}
      delayLongPress={1000}
      bottomDivider 
      chevron                 
    />    
  )

  render() {       
    
    const getHeader = () => {
      return  <View style={{ backgroundColor: 'white', flex: 1 }}>      
        <KeyboardAvoidingView
          behavior="position"
          style={{ justifyContent: 'space-between' }}>
            <Text style={{ marginLeft: 20, marginTop: 10 }}>
              Selecione o Cliente
            </Text>
            <Picker                                             
              style={{ width: 250, marginLeft: 15 }}
              selectedValue={this.state.selectedCustomer}                              
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedCustomer: itemValue })}>            
              {
                this.state.customers.map((item) => {
                  return <Picker.Item label={item.item} value={item.id} key={item.id} />
                })   
              }             
            </Picker>
            <Text style={{ marginLeft: 20, marginTop: 10 }}>
              Selecione o Meio de Venda
            </Text>
            <Picker                                             
              style={{ width: 250, marginLeft: 15 }}
              selectedValue={this.state.selectedSellingWay}                              
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selectedSellingWay: itemValue })}>            
              {
                this.state.sellingWays.map((item) => {
                  return <Picker.Item label={item.item} value={item.id} key={item.id} />
                })   
              }             
            </Picker>
            <Text style={{ marginLeft: 20, marginTop: 10 }}>Data da Venda</Text>
            <TextInputMask
              placeholder={moment(new Date()).format("DD/MM/YYYY")}
              style={styles.textInput}
              type={'datetime'}
              options={{
                format: 'DD/MM/YYYY'
              }}
              value={this.state.date}
              onChangeText={(text) => this.updateTextInput(text, 'date')}  
              ref={(ref) => this.dateField = ref}              
            />       
        </KeyboardAvoidingView>           
        </View>               
    };

   const getFooter = () => {
     return <View style={{ backgroundColor: 'white', flex: 1 }}>
        <KeyboardAvoidingView>
          <Text style={{ marginLeft: 20, marginTop: 10 }}>Valor de Venda</Text>
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
            value={this.state.saleprice}
            onChangeText={(text) => this.updateTextInput(text, 'saleprice')}                  
            ref={(ref) => this.salePriceField = ref}              
          />
          <Text style={{ marginLeft: 20, marginTop: 10 }}>Valor Líquido Final</Text>
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
            value={this.state.finalprice}
            onChangeText={(text) => this.updateTextInput(text, 'finalprice')}                
            ref={(ref) => this.finalPriceField = ref}
          />       
          <Text style={{ marginLeft: 20, marginTop: 10 }}>Valor Pago</Text>
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
            value={this.state.amountpaid}
            onChangeText={(text) => this.updateTextInput(text, 'amountpaid')}                
            ref={(ref) => this.amountPaidField = ref}
          />           
          <Text style={{ marginLeft: 20, marginTop: 10 }}>Observações</Text>
          <TextInput
            placeholder="Observações"
            multiline={true}
            style={styles.textInput}
            value={this.state.observations}
            onChangeText={(text) => this.updateTextInput(text, 'observations')}
          />
          <Button
            icon={{name: 'save', color: '#FFF'}}         
            title="Salvar Venda"
            buttonStyle={styles.button}                
            onPress={() => this.saveSale()}
          /> 
        </KeyboardAvoidingView>
      </View>        
    };

    const emptyList = () => {
      return (
        <View style={{ backgroundColor: 'white', flex: 1, marginBottom: 10, marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: "center"}}>{this.state.productNotFound}</Text>          
          <Button              
            icon={{ name: 'add-circle-outline', color: 'white'}}
            title="Adicionar"
            buttonStyle={{ marginLeft: 100, marginRight: 100, marginTop: 10, padding: 10, borderRadius: 80 }}
            onPress={() => this.props.navigation.navigate('RegisterSaleProduct')}
          />          
        </View>
      )
    }

    if(this.state.isLoading){
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.props.route.params.update){
      this.props.route.params.update = false;
      productSale.push(
        this.props.params.productSallingWaySale
      )
    }

    return(            
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>        
        <FlatList                  
          keyExtractor={this.keyExtractor}
          data={this.state.productSale}        
          refreshing={this.state.isLoading}
          onRefresh={() => this.onRefresh()}        
          renderItem={this.renderItem}
          ListHeaderComponent={getHeader}
          ListFooterComponent={getFooter} 
          ListEmptyComponent={emptyList}         
        /> 
        {!this.state.productSale.length === 0 && (
          <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('RegisterSaleProduct', {
            id: `${this.state.id}`,
            name: `${this.state.selectedCustomer.name}`
          })}
          title="+"
          style={styles.touchableOpacityStyle}>
            <Image
              source={require('../../images/add2.png')}
              style={styles.floatingButtonStyle}
              />
        </TouchableOpacity>               
        )}  
                   
      </SafeAreaView>
    );
  }  
}
