import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, Text, Picker } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../stylesheet/stylesheet';
import moment from 'moment';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import SaleDb from '../../database/Sale';
import CustomerDb from '../../database/Customer';
import ProductDb from '../../database/Product';
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
const SellingWay = new SellingWayDb();


export default class RegisterSale extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      date: '',       
      idcustomer: '', 
      idsellingway: '', 
      observations: '', 
      saleprice: '', 
      finalprice: '', 
      amountpaid: '',
      pendingpayment: '',       
      isLoading: '',      
      selectedCustomer: {},
      selectedSellingWay: {},
      selectedProduct: {},
      products: [],
      sellingWays: [],
      customers: []
    };          
  }

  componentDidMount() {    
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
    console.log("valor pendente: ", pendigPaymentValue)
    if( pendigPaymentValue < 0) {
      
      console.log("CAIU NO IF!!!!");
    } else {
      pending = false
      console.log("CAIU NO ELSE!!!!");
    }
    console.log("ESTADO DO PAGAMENTO: ", this.state.pendingpayment);

    let finalPrice = 0;
    let salePrice = 0;
    let amountPaid = 0;

    if(this.salePriceField.getRawValue() !== null) {
      salePrice = this.salePriceField.getRawValue();
    }

    if(this.finalPriceField.getRawValue() !== null) {
      finalPrice = this.finalPriceField.getRawValue();
    }
    
    if(this.amountPaidField.getRawValue() !== null) {
      amountPaid =  this.amountPaidField.getRawValue();
    }

      let data = {      
      date: this.state.date,       
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
      } else {
        Alert.alert(
          "Cadastro de Venda",
          `Não foi possível realizar o cadastro!\n O seguinte erro foi retornado: ${result}`,
          [
            {
              text: "OK", 
              onPress: () => this.props.navigation.navigate('RegisterSale'),               
            }
          ],
          { cancelable: false }
        );
      }
      
      //this.props.navigation.navigate('Main');
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Venda",
        "Não foi possível realizar o cadastro! - " + err,
        [
          {
            text: "OK", 
            onPress: () => this.props.navigation.navigate('Sales', { update: true }), 
            icon: "done"
          }
        ],
        { cancelable: false }
      );
    });
  }

  render() {    
    return(      
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
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
                ref={(ref) => this.date = ref}              
              />       
              <Text style={{ marginLeft: 20, marginTop: 10 }}>Valor de Venda</Text>
              <TextInputMask       
                placeholder="R$ 0,00"         
                style={styles.textInput}
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$',
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
                  unit: 'R$',
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
                  unit: 'R$',
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
 
          </KeyboardAvoidingView>                  
          <Button
            icon={{name: 'save', color: '#FFF'}}         
            title="Cadastrar"
            buttonStyle={styles.button}                
            onPress={() => this.saveSale()}
          />
        </ScrollView>
      </View>
    );
  }  
}
