export const generateUniqueRandomNumbers = () => {
  const uniqueNumbers: number[] = [];
  while (uniqueNumbers.length < 9) {
    const randomNum = Math.floor(Math.random() * 9) + 1;
    if (!uniqueNumbers.includes(randomNum)) {
      uniqueNumbers.push(randomNum);
    }
  }

  return uniqueNumbers;
};
