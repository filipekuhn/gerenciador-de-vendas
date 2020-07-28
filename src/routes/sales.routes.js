import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Sales from '../pages/sale/sales';
import Sale from '../pages/sale/sale';
import RegisterSale from '../pages/sale/registerSale';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function WildCard({ title }) {
  return <Text>Wildcard {title}</Text>
}

export default function SalesRoutes() {
  return(
    <Tab.Navigator initialRouteName="Sales">
      <Tab.Screen name="Sales" component={Sales} options={{ title: "Vendas" }} initialParams={{ titleName: 'Vendas' }} />
      <Tab.Screen name="Pending" component={Sale} />
      <Tab.Screen name="Payed" component={Sale} />
      <Tab.Screen name="Preview" component={Sale} />
    </Tab.Navigator>    
  )
}