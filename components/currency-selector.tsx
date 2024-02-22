import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  // Pressable,
  VirtualizedList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {
  getCurrencyPairs,
  getCurrencyPairsResponse,
  pair,
} from '../services/get-currency-pairs';
import { useQuery } from 'react-query';
import { useCurrency } from '../context/currency-context';
import { Image, Text, View, VisuallyHidden } from 'tamagui';

export const CurrencySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<pair>();
  const { changeCurrency } = useCurrency();
  const { data: currencyPairs } = useQuery('currency-pairs', getCurrencyPairs);

  const handleSelect = (pair: pair) => {
    setSelectedCurrency(pair);
    setIsOpen(false);
    changeCurrency(pair.id);
  };

  useEffect(() => {
    if (!!!selectedCurrency && currencyPairs?.length) {
      setSelectedCurrency(currencyPairs[0]);
      changeCurrency(currencyPairs[0].id);
    }
  }, [currencyPairs, selectedCurrency]);

  return (
    <View>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => {
          setIsOpen(true);
        }}
      >
        {selectedCurrency?.url_logo_png && (
          <Image
            source={{ uri: selectedCurrency.url_logo_png }}
            style={styles.logo}
          />
        )}
        <Text style={styles.currencyText}>{selectedCurrency?.description}</Text>
        <Text>▼</Text>
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsOpen(false)}
        statusBarTranslucent
        hardwareAccelerated
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
            <View style={styles.dropdownContainer}>
              <VirtualizedList
                persistentScrollbar
                getItemCount={() => 25}
                keyExtractor={(item, i) => String(i)}
                getItem={(item, i) => {
                  return item[i];
                }}
                data={currencyPairs}
                renderItem={({ item }) => {
                  const obj = item as getCurrencyPairsResponse[number];
                  return (
                    <View style={styles.item} onPress={() => handleSelect(obj)}>
                      {obj.url_logo_png && (
                        <Image
                          source={{ uri: obj.url_logo_png }}
                          style={styles.logo}
                        />
                      )}
                      <Text>{obj.description}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  currencyText: {
    flex: 1,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  arrow: {
    width: 15,
    height: 15,
  },
  dropdownContainer: {
    elevation: 3,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});
