import React from 'react';
import {
  StyleSheet,
  VirtualizedList,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { ScrollView, Text, View, XStack } from 'tamagui';
const extractVolumeData = (orders: any[]) => {
  const volumeData = {} as { [key: string]: any };

  orders?.forEach((order: any) => {
    Object.keys(order)?.forEach((key) => {
      if (key.endsWith('_volume') && key !== 'idr_volume') {
        const volumeType = key.replace('_volume', '');
        const title = volumeType.toUpperCase();
        if (!volumeData[title]) {
          volumeData[title] = [];
        }
        volumeData[title].push({
          volume: order[key],
          price: order.price,
          idr: order.idr_volume,
        });
      }
    });
  });
  return volumeData;
};

export interface OrderBookProps {
  orders: any[];
  id?: string;
}
export const OrderBook = React.memo(({ orders, id }: OrderBookProps) => {
  // Extract volume data
  const volumeData = extractVolumeData(orders);

  // Function to render table row
  const renderRow = (data: any, index: number) => {
    return (
      <XStack
        justifyContent="space-between"
        alignItems="center"
        key={index}
        style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
      >
        <Text>{data.price}</Text>
        <Text>{data.volume}</Text>
        <Text>{data.idr}</Text>
      </XStack>
    );
  };

  return (
    <View id={id}>
      {Object.entries(volumeData)?.map(([title, data], index) => {
        return (
          <View key={index} h={'90%'}>
            <ScrollView>
              <VirtualizedList
                nestedScrollEnabled
                initialNumToRender={4}
                refreshing
                data={data}
                getItemCount={() => 30}
                renderItem={({ item, index }) => {
                  return renderRow(item, index);
                }}
                keyExtractor={(item, i) => String(i)}
                getItem={(item, i) => {
                  return item[i];
                }}
                ListHeaderComponent={
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text>Price (IDR)</Text>
                    <Text>{title}</Text>
                    <Text>IDR</Text>
                  </XStack>
                }
              />
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  // headerRow: {
  //   flexDirection: 'row',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ccc',
  //   paddingBottom: 5,
  //   marginBottom: 5,
  //   justifyContent: 'space-between',
  // },
  // headerText: {
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   flex: 1,
  // },
  evenRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    paddingVertical: 5,
  },
  oddRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  // cell: {
  //   textAlign: 'center',
  //   flex: 1,
  // },
});
