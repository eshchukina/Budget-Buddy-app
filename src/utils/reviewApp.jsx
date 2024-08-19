import {Linking} from 'react-native';

const reviewPage = () => {
  const reviewPageURL =
    'https://play.google.com/store/apps/details?id=com.uneteambudgetbuddy';

  Linking.openURL(reviewPageURL)
    .then(supported => {
      if (!supported) {
        console.log('Failed to open the reviews page in the Google Play Store');
      }
    })
    .catch(err => console.error('Error review: ', err));
};

export default reviewPage;
