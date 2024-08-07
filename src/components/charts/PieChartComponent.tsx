import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {useTranslation} from 'react-i18next';

interface PieChartComponentProps {
  groupedData: {[key: string]: {value: number; color: string; text: string}};
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({groupedData}) => {
  const {t} = useTranslation();
  const pieChartData = Object.values(groupedData);
  const sortedPieChartData = pieChartData.sort((a, b) => b.value - a.value);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>{t('chart')}</Text>
      <View style={styles.wrapper}>
        <PieChart
          labelsPosition={'outward'}
          data={pieChartData}
          radius={90}
          initialAngle={0}
          showText={false}
          fontStyle="oblique"
          font="Montserrat-Medium"
          extraRadiusForFocused={120 / 10}
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
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  wrapper: {
    flexDirection: 'row',
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
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#5e718b',
  },
});

export default PieChartComponent;
