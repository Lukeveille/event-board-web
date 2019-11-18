export default string => {
  const symbols = [
    ['+', ' '],
    ['%20', ' '],
    ['%21', '!'],
    ['%22', '"'],
    ['%23', '#'],
    ['%24', '$'],
    ['%25', '%'],
    ['%26', '&'],
    ['%27', '\''],
    ['%28', '('],
    ['%29', ')'],
    ['%2A', '*'],
    ['%2B', '+'],
    ['%2C', ','],
    ['%2D', '-'],
    ['%2E', '.'],
    ['%2F', '/']
  ];
  let newString = string;
  
  symbols.forEach(symbol => {
    if (string.includes(symbol[0])) {
      newString = string.replace(symbol[0], symbol[1]);
    };
  });

  return newString;
};