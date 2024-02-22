import React from 'react';
import {
  VictoryChart,
  VictoryAxis,
  VictoryCandlestick,
  VictoryTheme,
  VictoryZoomContainer,
} from 'victory-native';
import { ActivityIndicator, Dimensions } from 'react-native';
import { useQuery } from 'react-query';
import { getHistoryPairs, history } from '../services/get-history-pairs';
import { useCurrency } from '../context/currency-context';
const screenWidth = Dimensions.get('window').width;

export interface CandleStickChartProps {
  data?: {
    x: string;
    open: number;
    close: number;
    high: number;
    low: number;
  }[];
}
const animate = {
  animate: {
    duration: 2000,
    onLoad: { duration: 1000 },
  },
};

const formattedData = (array: history[]) =>
  array.map((d) => ({
    x: new Date(d.Time * 1000),
    open: d.Open,
    close: d.Close,
    high: d.High,
    low: d.Low,
  }));
export const CandleStickChart = () => {
  const { selectedCurrency } = useCurrency();

  const { data: historyPairs, isLoading } = useQuery(
    ['history-pairs', selectedCurrency],
    () => getHistoryPairs({ selectedCurrency }),
  );

  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <VictoryChart
      theme={VictoryTheme.material}
      scale={{ x: 'time' }}
      width={screenWidth * 0.95}
      containerComponent={
        <VictoryZoomContainer zoomDimension="x" {...animate} />
      }
    >
      <VictoryAxis dependentAxis style={{ tickLabels: { angle: -60 } }} />
      <VictoryAxis fixLabelOverlap />
      <VictoryCandlestick
        candleWidth={3}
        candleColors={{ positive: 'green', negative: 'red' }}
        data={formattedData(historyPairs || [])}
      />
    </VictoryChart>
  );
};
