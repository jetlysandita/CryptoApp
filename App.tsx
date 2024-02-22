import '@tamagui/core/reset.css';

import { TamaguiProvider, View } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { SafeAreaView, SectionList, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCustomFonts } from './hooks/useFonts';
import { CurrencySelector } from './components/currency-selector';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CandleStickChart } from './components/candle-stick-chart';
import { CurrencyProvider } from './context/currency-context';
import { AskBidOrder } from './components/ask-bid-order';
const queryClient = new QueryClient();

const SECTION = [
  {
    data: [
      <View>
        <CurrencySelector />
      </View>,
      <View>
        <CandleStickChart />
      </View>,
      <View>
        <AskBidOrder />
      </View>,
    ],
  },
];

export default function App() {
  const [loaded] = useCustomFonts();

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <GestureHandlerRootView>
        <QueryClientProvider client={queryClient}>
          <TamaguiProvider config={tamaguiConfig}>
            <CurrencyProvider>
              <SectionList
                style={{
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }}
                sections={SECTION}
                keyExtractor={(_, index) => String(index)}
                renderItem={({ item }) => <View>{item}</View>}
              />
            </CurrencyProvider>
          </TamaguiProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
