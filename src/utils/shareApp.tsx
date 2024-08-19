import {Share, Platform} from 'react-native';

const shareApp = async (): Promise<void> => {
  try {
    const message =
      'Check out this app! https://play.google.com/store/apps/details?id=com.uneteambudgetbuddy';
    if (Platform.OS === 'ios') {
      await Share.share({
        message,
        title: 'Check out this app',
      });
    } else {
      await Share.share({
        message,
      });
    }
  } catch (error: any) {
    console.error(error.message);
  }
};

export default shareApp;
