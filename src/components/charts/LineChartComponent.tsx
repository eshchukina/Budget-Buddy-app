import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {useTranslation} from 'react-i18next';

interface LineChartComponentProps {
  lineChartData: any[];
  currency: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  lineChartData,
  currency,
}) => {
  const {t} = useTranslation();
  if (!currency) {

  }
  return (
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
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#5e718b',
  },
  currencyContainer: {
    paddingLeft: 5,
  },
  currencyText: {
    color: '#e2a55e',
  },
});

export default LineChartComponent;
