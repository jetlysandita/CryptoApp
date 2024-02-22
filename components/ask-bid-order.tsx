import { useEffect, useState } from 'react';
import { useCurrency } from '../context/currency-context';
import { Text, YStack } from 'tamagui';
import { OrderBook } from './order-book';
import { ActivityIndicator } from 'react-native';

export const AskBidOrder = () => {
  const { selectedCurrency } = useCurrency();
  const [askOrders, setAskOrders] = useState([]);
  const [bidOrders, setBidOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleWebSocketMessage = (event: MessageEvent<any>) => {
    const response = JSON.parse(event.data);
    if (
      JSON.stringify(askOrders) !== JSON.stringify(response.data.ask) ||
      JSON.stringify(bidOrders) !== JSON.stringify(response.data.bid)
    ) {
      setIsLoading(false);
      setAskOrders(response.data.ask);
      setBidOrders(response.data.bid);
    }
  };
  useEffect(() => {
    if (selectedCurrency) {
      setIsLoading(true);
      const connect = () => {
        const wsUrl = `wss://f50c79aa-9aed-4b6b-8c4d-3906aeb814ab-00-3rlbmme9mommj.sisko.replit.dev?pair=${selectedCurrency}`;
        const ws = new WebSocket(wsUrl);

        // Event listeners for WebSocket events
        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = handleWebSocketMessage;

        ws.onclose = (err) => {
          console.log('WebSocket disconnected', err);
          setTimeout(function () {
            connect();
          }, 1000);
        };
        return ws;
      };
      const ws = connect();

      return () => {
        ws.close();
      };
    }
  }, [selectedCurrency]);

  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <YStack flex={1} position="relative" gap={16}>
      <YStack maxHeight={150}>
        <Text>Ask Order</Text>
        <OrderBook orders={askOrders} id="ask" />
      </YStack>
      <YStack height={150} position="relative">
        <Text>Bid Order</Text>
        <OrderBook orders={bidOrders} id="bid" />
      </YStack>
    </YStack>
  );
};
