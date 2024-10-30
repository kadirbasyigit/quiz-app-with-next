export const generateUniqueRandomNumbers = () => {
  const uniqueNumbers = new Set<number>();

  while (uniqueNumbers.size < 9) {
    uniqueNumbers.add(Math.floor(Math.random() * 9) + 1);
  }

  return Array.from(uniqueNumbers);
};
