import React, {useState, useEffect, useRef} from 'react';
import {Modal, View, Text, StyleSheet, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_API_URL_PRODUCTION} from '@env';
import {Picker} from '@react-native-picker/picker';
import Button from '../buttons/Buttons';
import {useTranslation} from 'react-i18next';

interface CurrencyExchangeProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CurrencyExchange: React.FC<CurrencyExchangeProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const [amount1, setAmount1] = useState<string>('');
  const [amount2, setAmount2] = useState<string>('');
  const [conversionRates, setConversionRates] = useState<
    Record<string, number>
  >({});
  const [sourceCurrency, setSourceCurrency] = useState<string>('GBP');
  const [targetCurrency, setTargetCurrency] = useState<string>('GEL');
  const currencies = ['EUR', 'GBP', 'GEL', 'TRY', 'RUB', 'USD'];
  const inputRef1 = useRef<TextInput | null>(null);
  const inputRef2 = useRef<TextInput | null>(null);
  const {t} = useTranslation();

  const updateConversionRates = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.log('No access token found.');
        return;
      }
      const headersWithToken = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${REACT_APP_API_URL_PRODUCTION}exchange`, {
        headers: headersWithToken,
      });
      if (!response.ok) {
        console.log('Error fetching conversion rates.', response.status);
        return;
      }
      const data = await response.json();
      const newConversionRates = data.quotes;
      console.log(newConversionRates);
      if (Object.values(newConversionRates).some(rate => rate !== 0)) {
        await AsyncStorage.setItem(
          'conversionRates',
          JSON.stringify(newConversionRates),
        );
        await AsyncStorage.setItem(
          'lastUpdateTimestamp',
          Date.now().toString(),
        );
        setConversionRates(newConversionRates);
      } else {
        console.log('Received zero conversion rates. Using the existing data.');
      }
    } catch (error) {
      console.log('Error fetching conversion rates:', error);
    }
  };

  useEffect(() => {
    const fetchStoredConversionRates = async () => {
      const storedConversionRates = await AsyncStorage.getItem(
        'conversionRates',
      );
      const lastUpdateTimestamp = await AsyncStorage.getItem(
        'lastUpdateTimestamp',
      );

      if (storedConversionRates && lastUpdateTimestamp) {
        const parsedConversionRates = JSON.parse(storedConversionRates);
        const hoursElapsed =
          (Date.now() - parseInt(lastUpdateTimestamp)) / (1000 * 60 * 60);

        if (hoursElapsed < 1) {
          setConversionRates(parsedConversionRates);
        } else {
          updateConversionRates();
        }
      } else {
        updateConversionRates();
      }
      const intervalId = setInterval(updateConversionRates, 1000 * 60 * 30);
      return () => clearInterval(intervalId);
    };
    fetchStoredConversionRates();
  }, [modalVisible]);

  const handleAmountChange1 = (value: string) => {
    if (!isNaN(Number(value)) || value === '') {
      setAmount1(value);
      const convertedAmount = convertCurrency(
        Number(value),
        sourceCurrency,
        targetCurrency,
      );
      setAmount2(convertedAmount);
    }
  };

  const handleAmountChange2 = (value: string) => {
    if (!isNaN(Number(value)) || value === '') {
      setAmount2(value);
      const convertedAmount = convertCurrency(
        Number(value),
        targetCurrency,
        sourceCurrency,
      );
      setAmount1(convertedAmount);
    }
  };

  const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): string => {
    const sourceRate = conversionRates[`USD${fromCurrency}`];
    const targetRate = conversionRates[`USD${toCurrency}`];

    if (sourceRate && targetRate) {
      const convertedAmount = (amount / sourceRate) * targetRate;
      return convertedAmount.toFixed(2);
    }
    return '';
  };

  const handleSourceCurrencyChange = (value: string) => {
    setSourceCurrency(value);
    const convertedAmount = convertCurrency(
      Number(amount1),
      value,
      targetCurrency,
    );
    setAmount2(convertedAmount);
  };

  const handleTargetCurrencyChange = (value: string) => {
    setTargetCurrency(value);
    const convertedAmount = convertCurrency(
      Number(amount1),
      sourceCurrency,
      value,
    );
    setAmount2(convertedAmount);
  };

  const handleCloseConverterForm = () => {
    setAmount1('');
    setAmount2('');
    if (inputRef1.current) {
      inputRef1.current.focus();
    }
    updateConversionRates();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.headerCurrency}>{t('converter')}</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{t('from')}</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef1}
              style={styles.input}
              value={amount1}
              onChangeText={handleAmountChange1}
              placeholder={`Enter amount in ${sourceCurrency}`}
              keyboardType="numeric"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sourceCurrency}
                style={styles.picker}
                onValueChange={handleSourceCurrencyChange}>
                {currencies.map(currency => (
                  <Picker.Item
                    key={currency}
                    label={currency}
                    value={currency}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{t('to')}</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef2}
              style={styles.input}
              value={amount2}
              onChangeText={handleAmountChange2}
              placeholder={`Enter amount in ${targetCurrency}`}
              keyboardType="numeric"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={targetCurrency}
                style={styles.picker}
                onValueChange={handleTargetCurrencyChange}>
                {currencies.map(currency => (
                  <Picker.Item
                    key={currency}
                    label={currency}
                    value={currency}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              text={t('clear')}
              color="#b4bfc5"
              padding={10}
              onPress={handleCloseConverterForm}
            />
            <Button
              text={t('close')}
              color="#b4bfc5"
              padding={10}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: '#5e718b90',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#f6f6f5',
    padding: 20,
    width: '90%',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  input: {
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
    fontSize: 13,
    width: '60%',
    borderColor: '#e5c5bd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5c5bd',
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
  },
  pickerItem: {
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
  },
  labelContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 5,
  },
  label: {
    fontFamily: 'Montserrat-Medium',
    color: '#5e718b',
    fontSize: 13,
  },
  headerCurrency: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
    color: '#5e718b',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default CurrencyExchange;
