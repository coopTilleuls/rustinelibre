export const validatePassword = (value: string): boolean => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?.+=;/\\:,_"&])[A-Za-z\d@$!%*#?.+=;,/:_"&\\]{12,}$/;
  return regex.test(value);
};
