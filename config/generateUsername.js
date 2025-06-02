import { customAlphabet } from "nanoid";
export const generateUsername = () => {
  const generateLetters = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6); // 5 random letters
  const generateNumbers = customAlphabet("0123456789", 4); // 3 random digits
  const generateSpecialChar = customAlphabet("!@#$%^&*", 1);
  const letters = generateLetters(); // Generate 5 letters
  const numbers = generateNumbers(); // Generate 3 digits
  const specialChar = generateSpecialChar();
  return `${letters}${specialChar}${numbers}`;
};
