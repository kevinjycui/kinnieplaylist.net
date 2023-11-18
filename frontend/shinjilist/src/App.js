import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './src/Homes.js'
import ListScreen from './src/List.js'

const navigator = createStackNavigator ({
  Home: HomeScreen,
  List: ListScreen
}, {
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    headerShown: false
  }
});

export default createAppContainer(navigator)