export default (datetime) => {
  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  dateTimeArray = datetime.split('T'),
  dateArray = dateTimeArray[0].split('-'),
  dateString = `${months[dateArray[1]-1]} ${dateArray[2]}, ${dateArray[0]}`,
  timeArray = dateTimeArray[1].split(':'),
  hour = parseInt(timeArray[0]),
  timeString = `${hour < 12? hour === 0? 12 : parseInt(timeArray[0]) : parseInt(timeArray[0] - 12)}:${timeArray[1]}${timeArray[0] < 12? 'a' : 'p'}m`;

  return [dateString, timeString];
};
