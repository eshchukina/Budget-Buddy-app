import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

import {LineChart, PieChart} from 'react-native-gifted-charts';

interface DetailsScreenProps {
  amounts: number[];
  tags: string[];
  accountId: any;
  monthlyAmounts: any;
  currency: string;
}
const DetailsScreen: React.FC<DetailsScreenProps> = ({
  monthlyAmounts,
  accountId,
  amounts,
  tags,
  currency,
}) => {
  const [groupedData, setGroupedData] = useState({});
  const {t} = useTranslation();

  useEffect(() => {
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

    const newGroupedData = tags.reduce((acc, tag, index) => {
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
      case 'other':
        return '#fff';
      default:
        return '#fff';
    }
  };

  const pieChartData = Object.values(groupedData);
  const lineChartData = monthlyAmounts.map(item => ({
    value: item.amount,
    label: item.month,
    yAxisLabelText: item.amount.toString(),
    dataPointText: item.amount.toString(),
    textShiftX: 6,
    textShiftY: 1,
    textColor: '#5e718b',
    textFontSize: 11,
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

  const sortedPieChartData = pieChartData.sort((a, b) => b.value - a.value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('chart')}</Text>

      <View style={styles.chartContainer}>
        <PieChart
          labelsPosition={'outward'}
          data={pieChartData}
          radius={90}
          initialAngle={0}
          showText={false}
          fontStyle="oblique"
          font="Montserrat-Medium"
          aRadiusForFocused={120 / 10}
          sectionAutoFocus={true}
          shadow={false}
          strokeWidth={0}
          textColor="black"
          showTextBackground={false}
          textBackgroundColor="#5e718b"
          textBackgroundRadius={16}
          innerRadius={120 / 2}
          innerCircleBorderWidth={0}
          innerCircleBorderColor="#5e718b"
          shiftInnerCenterX={0}
          shiftInnerCenterY={0}
          tilt={0.5}
          yAxisThickness={1}
          yAxisColor="#5e718b"
          yAxisLabelWidth={35}
          yAxisTextStyle={{fontSize: 10, color: '#5e718b'}}
          yAxisTextNumberOfLines={1}
          yAxisLabelContainerStyle={{padding: 0}}
          yAxisSide="left"
          showFractionalValues={false}
          roundToDigits={1}
          hideYAxisText={false}
          formatYLabel={(label: any) => `${label}`}
          rulesLength={Dimensions.get('window').width - 10}
          rulesColor="#5e718b"
          rulesThickness={1}
          hideRules={false}
          rulesType="solid"
          dashWidth={4}
          dashGap={8}
          showReferenceLine1={true}
          referenceLine1Position={150}
          showVerticalLines={true}
          verticalLinesColor="#5e718b"
          verticalLinesThickness={1}
          verticalLinesHeight={300}
          showXAxisIndices={true}
          xAxisIndicesHeight={2}
          xAxisIndicesWidth={4}
          xAxisIndicesColor="#5e718b"
          showYAxisIndices={true}
          yAxisIndicesHeight={2}
          yAxisIndicesWidth={4}
          yAxisIndicesColor="#5e718b"
          showDataPoints
          dataPointsColor="#5e718b"
          endReachedOffset={80}
          textSize={12}
        />
        <View style={styles.legendContainer}>
          {sortedPieChartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColorBox, {backgroundColor: item.color}]}
              />
              <Text style={styles.text}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('chartTwo')}</Text>
        </View>
        <View style={styles.currencyContainer}>
          <Text style={styles.currencyText}>{currency}</Text>
        </View>
        <LineChart
          data={lineChartData}
          overflowBottom={0}
          animateOnDataChange={true}
          spacing={30}
          adjustToWidth={true}
          areaChart
          showScrollIndicator={true}
          indicatorColor="white"
          isAnimated={true}
          scrollToEnd={false}
          scrollAnimation={true}
          scrollEventThrottle={0}
          initialSpacing={15}
          endSpacing={0}
          yAxisThickness={-10}
          xAxisThickness={0}
          hideRules
          dataPointsColor="#5e718b"
          yAxisColor="#5e718b"
          yAxisTextStyle={{fontSize: 12, color: '#5e718b'}}
          yAxisTextNumberOfLines={1}
          showFractionalValues={false}
          roundToDigits={1}
          hideYAxisText={false}
          formatYLabel={label => `${label}`}
          rulesLength={Dimensions.get('window').width - 40}
          rulesThickness={1}
          showVerticalLines={true}
          verticalLinesThickness={1}
          xAxisIndicesHeight={2}
          xAxisIndicesWidth={4}
          xAxisIndicesColor="#f6f6f5"
          yAxisIndicesHeight={2}
          yAxisIndicesWidth={4}
          yAxisIndicesColor="#f6f6f5"
          endReachedOffset={80}
          curvature={0.2}
          thickness={2}
          thickness1={2}
          thickness2={2}
          zIndex1={0}
          zIndex2={0}
          endIndex={1}
          startIndex1={0}
          endIndex1={11}
          lineGradient={true}
          lineGradientDirection="vertical"
          lineGradientStartColor="#96aa9a"
          lineGradientEndColor="#96aa9a"
          startFillColor="#96aa9a"
        />
      </View>
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
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  legendContainer: {
    marginBottom: 5,
    marginTop: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  text: {
    color: '#5e718b',
    fontFamily: 'Montserrat-Medium',
  },
  legendColorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 50,
  },
  currencyText: {
    color: '#e2a55e',
  },
  currencyContainer: {
    paddingLeft: 5,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#5e718b',
  },
});

export default DetailsScreen;
