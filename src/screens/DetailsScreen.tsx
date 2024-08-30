import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';

interface DetailsScreenProps {
  amounts: number[];
  tags: string[];
  accountId: any;
  monthlyAmounts: any[];
  currency: string;
}

interface GroupedData {
  [key: string]: {
    value: number;
    color: string;
    text: string;
  };
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({
  monthlyAmounts,
  accountId,
  amounts,
  tags,
  currency,
}) => {
  const [groupedData, setGroupedData] = useState<GroupedData>({});

  useEffect(() => {
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

    const newGroupedData = tags.reduce<GroupedData>((acc, tag, index) => {
      if (!acc[tag]) {
        acc[tag] = {
          value: amounts[index],
          color: getColorForTag(tag),
          text: '',
        };
      } else {
        acc[tag].value += amounts[index];
      }
      const percentage = ((acc[tag].value / totalAmount) * 100).toFixed(1);
      acc[tag].text = `${tag} ${percentage}%`;
      return acc;
    }, {});

    setGroupedData(newGroupedData);
  }, [accountId, tags, amounts]);

  const getColorForTag = (tag: string): string => {
    switch (tag) {
      case 'food':
        return '#cf7041';
      case 'transport':
        return '#e5c5bd';
      case 'health':
        return '#e2a55e';
      case 'pets':
        return '#5e718b';
      case 'gifts':
        return '#96aa9a';
      case 'hobby':
        return '#b4bfc5';
      case 'entertainment':
        return '#9a5433';
      case 'cloth':
        return '#ab8e88';
      case 'moneyBox':
        return '#b68448';
      case 'trips':
        return '#374557';
      case 'credit':
        return '#4e7556';
      case 'shop':
        return '#889298';
      case 'rent':
        return 'grey';
      case 'education':
        return 'pink';
      case 'other':
        return '#fff';
      default:
        return '#fff';
    }
  };

  const lineChartData = monthlyAmounts.map(item => ({
    value: item.amount,
    label: item.month,
    yAxisLabelText: item.amount.toString(),
    dataPointText: item.amount.toString(),
    textShiftX: 6,
    textShiftY: 1,
    textColor: '#5e718b',
    textFontSize: 1,
    dataPointHeight: 10,
    dataPointWidth: 9,
    dataPointColor: '#e2a55e',
    dataPointShape: 'circular',
    hideDataPoint: false,
    showVerticalLine: true,
    verticalLineUptoDataPoint: true,
    verticalLineColor: '#96aa9a',
    verticalLineThickness: 1,
    dataPointLabelWidth: 50,
    dataPointLabelShiftX: 0,
    dataPointLabelShiftY: -0,
    showStrip: false,
    stripHeight: 100,
    stripWidth: 1,
    stripColor: '#cf7041',
    stripOpacity: 0.5,
    pointerShiftX: 0,
    pointerShiftY: 0,
  }));

  return (
    <View style={styles.container}>
      <PieChartComponent groupedData={groupedData} />
      <LineChartComponent lineChartData={lineChartData} currency={currency} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,
    height: '100%',
    backgroundColor: '#f6f6f5',
    alignItems: 'center',
  },
});

export default DetailsScreen;
