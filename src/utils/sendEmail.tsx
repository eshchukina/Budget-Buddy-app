import {Linking} from 'react-native';

const sendEmail = () => {
  const email = 'unateamdev@gmail.com';
  const subject = 'Question from the app';
  const body = 'Hello, developer!';

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  Linking.openURL(mailtoLink).catch(err =>
    console.error('Error sending email:', err),
  );
};

export default sendEmail;
