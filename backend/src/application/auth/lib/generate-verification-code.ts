export const generateVerificationCode = () => {
  const min = 143294;
  const max = 947823;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};
