export const validateEmail = (email: string): boolean => {
  const re: RegExp = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  return password.length >= 6 && hasNumber && hasLetter;
};

export const validateName = (name: string): boolean => {
  const re: RegExp = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
  return name.length >= 2 && re.test(name);
};
