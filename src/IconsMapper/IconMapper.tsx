import React from 'react';
import Food from 'react-native-vector-icons/MaterialCommunityIcons';
import Car from 'react-native-vector-icons/FontAwesome5';
import Salary from 'react-native-vector-icons/FontAwesome5';
import Health from 'react-native-vector-icons/FontAwesome';
import Pet from 'react-native-vector-icons/MaterialIcons';
import Gift from 'react-native-vector-icons/FontAwesome5';
import Hobby from 'react-native-vector-icons/FontAwesome';
import Entertainment from 'react-native-vector-icons/FontAwesome';
import Cloth from 'react-native-vector-icons/Fontisto';
import MoneyBox from 'react-native-vector-icons/FontAwesome5';
import Trips from 'react-native-vector-icons/Fontisto';
import Credit from 'react-native-vector-icons/Ionicons';
import Rent from 'react-native-vector-icons/Ionicons';
import Shop from 'react-native-vector-icons/FontAwesome6';
import Other from 'react-native-vector-icons/MaterialIcons';
import Education from 'react-native-vector-icons/FontAwesome';

interface IconMapperProps {
  tag: string;
  size?: number;
  color?: string;
}

const IconMapper: React.FC<IconMapperProps> = ({
  tag,
  size = 25,
  color = '#96aa9a',
}) => {
  switch (tag) {
    case 'food':
      return <Food name="food-apple" size={size} color={color} />;
    case 'transport':
      return <Car name="car" size={size} color={color} />;
    case 'salary':
      return <Salary name="money-bill-alt" size={size} color={'#e2a55e'} />;
    case 'health':
      return <Health name="heartbeat" size={size} color={color} />;
    case 'pets':
      return <Pet name="pets" size={size} color={color} />;
    case 'gifts':
      return <Gift name="gift" size={size} color={color} />;
    case 'hobby':
      return <Hobby name="paint-brush" size={size} color={color} />;
    case 'entertainment':
      return <Entertainment name="birthday-cake" size={size} color={color} />;
    case 'cloth':
      return <Cloth name="shopping-bag-1" size={size} color={color} />;
    case 'moneyBox':
      return <MoneyBox name="piggy-bank" size={size} color={color} />;
    case 'trips':
      return <Trips name="suitcase" size={size} color={color} />;
    case 'credit':
      return <Credit name="card" size={size} color={color} />;
    case 'shop':
      return <Shop name="cart-shopping" size={size} color={color} />;
    case 'rent':
      return <Rent name="home" size={size} color={color} />;
    case 'education':
      return <Education name="book" size={size} color={color} />;
    case 'other':
      return <Other name="devices-other" size={size} color={color} />;
    default:
      return null;
  }
};

export default IconMapper;
