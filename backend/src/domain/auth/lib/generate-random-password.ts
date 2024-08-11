export function generateRandomPassword(length: number): string {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numericChars = '0123456789';
  const specialChars = '!@#$%^&*()-_+=[]{}|;:,.<>?';

  const allChars =
    lowercaseChars + uppercaseChars + numericChars + specialChars;

  let password = '';

  password += getRandomChar(lowercaseChars);
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(numericChars);
  password += getRandomChar(specialChars);

  for (let i = 4; i < length; i++) {
    password += getRandomChar(allChars);
  }

  password = shuffleString(password);

  return password;
}

function getRandomChar(characters: string): string {
  return characters[Math.floor(Math.random() * characters.length)];
}

function shuffleString(str: string): string {
  return str
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
