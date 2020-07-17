import React from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer, DrawerActions, DrawerRouter } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContent } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Main from './pages/main';
import Customer from './pages/customer';
import Customers from './pages/customers';
import EditCustomer from './pages/editCustomer';
import Sale from './pages/sale';
import RegisterCustomer from './pages/registerCustomer';
import SellingWay from './pages/sellingWay';
import SellingWays from './pages/sellingWays';
import RegisterSellingWay from './pages/registerSellingWay';
import FileFormat from './pages/fileFormat';
import FileFormats from './pages/fileFormats';
import RegisterFileFormat from './pages/registerFileFormat';
import EditFileFormat from './pages/editFileFormat';
import Products from './pages/products';
import Product from './pages/product';
import RegisterProduct from './pages/registerProduct';
import EditProduct from './pages/editProduct';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

createDrawer = () =>
  <Drawer.Navigator initialRouteName="Menu">
    <Drawer.Screen name="Menu" component={Main} />
    <Drawer.Screen name="Vendas" component={Customers} initialParams={{ update: false }} />
    <Drawer.Screen name="Financeiro" component={Products} />
    <Drawer.Screen name="Backup" component={FileFormats}  />    
  </Drawer.Navigator>


function App() {  
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Ts">
        <Stack.Screen 
          name="Ts"
          children={this.createDrawer}
          options={({ navigation }) => ({
            title: 'Menu',
            headerStyle: {backgroundColor: '#5390fe'}, 
            headerTintColor: '#FFF', 
            headerTitleAlign: 'left',
            headerLeft: () =>
              <Icon
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                style={[{ color: 'white', marginLeft: 8 }]}
                size={24}
                name={'menu'}
              />
          })
          }
        />

        <Stack.Screen name="Main" 
          component={Main} 
          options={{  title: "Menu Principal", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />         

        <Stack.Screen name="Customer" 
          component={Customer} 
          options={{  title: "Clientes", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} /> 
        
        <Stack.Screen name="Sales" 
          component={Sale} 
          options={{ title: "Vendas", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="RegisterCustomer" 
          component={RegisterCustomer} 
          options={{ title: "Cliente", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="EditCustomer" 
          component={EditCustomer} 
          options={{ title: "Editar dados do Cliente", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="Customers" 
          component={Customers} 
          options={{ title: "Clientes", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} 
          initialParams={{ update: false }}/>
        
        <Stack.Screen name="SellingWay" 
          component={SellingWay} 
          options={{ title: "Forma de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="SellingWays" 
          component={SellingWays} 
          options={{ title: "Formas de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="RegisterSellingWay" 
          component={RegisterSellingWay} 
          options={{ title: "Forma de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="FileFormat" 
          component={FileFormat} 
          options={{ title: "Formato de Arquivo", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="FileFormats" 
          component={FileFormats} 
          options={{ title: "Formatos de Arquivos", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />                  
        
        <Stack.Screen name="RegisterFileFormat" 
          component={RegisterFileFormat} 
          options={{ title: "Formato de Arquivo", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="EditFileFormat" 
          component={EditFileFormat} 
          options={{ title: "Editar Formato de Arquivo", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="Products"  
          component={Products} 
          options={{ title: "Produtos", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} 
          initialParams={{ update: false }}/>                  

        <Stack.Screen name="RegisterProduct" 
          component={RegisterProduct} 
          options={{ title: "Cadastro de Produto", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
      </Stack.Navigator>                  
    </NavigationContainer>
  );
}

export default App;

