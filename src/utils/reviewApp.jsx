import { Linking } from "react-native";

const reviewPage = () => {
  const reviewPageURL =
    "https://play.google.com/store/apps/details?id=com.budgetbuddyapp";

  Linking.openURL(reviewPageURL)
    .then((supported) => {
      if (!supported) {
        console.log("Не удалось открыть страницу отзывов в Google Play Store");
      }
    })
    .catch((err) => console.error("Ошибка при открытии ссылки: ", err));
};

export default reviewPage;
