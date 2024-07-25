import React from 'react';
import Usd from 'react-native-vector-icons/FontAwesome';
import EUR from 'react-native-vector-icons/FontAwesome';
import GBP from 'react-native-vector-icons/FontAwesome';
import GEL from 'react-native-vector-icons/FontAwesome6';
import TRY from 'react-native-vector-icons/FontAwesome';
import RUB from 'react-native-vector-icons/FontAwesome';

interface CurrencyIconProps {
  currency: string;
  size?: number;
  color?: string;
}

const CurrencyIcon: React.FC<CurrencyIconProps> = ({
  currency,
  size = 40,
  color = '#5e718b',
}) => {
  switch (currency) {
    case 'USD':
      return <Usd name="usd" size={size} color={color} />;
    case 'EUR':
      return <EUR name="eur" size={size} color={color} />;
    case 'GBP':
      return <GBP name="gbp" size={size} color={color} />;
    case 'GEL':
      return <GEL name="lari-sign" size={size} color={color} />;
    case 'TRY':
      return <TRY name="try" size={size} color={color} />;
    case 'RUB':
      return <RUB name="rub" size={size} color={color} />;
    default:
      return null;
  }
};

export default CurrencyIcon;
