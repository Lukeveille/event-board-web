export default num => { 
  num = parseInt(num);
  return ( num < 10? `0${num}` : num );
};
