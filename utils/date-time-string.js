export default (datetime) => {
  const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  dateTimeArray = datetime.split('T'),
  dateArray = dateTimeArray[0].split('-'),
  dateString = `${months[dateArray[1]-1]} ${dateArray[2]}, ${dateArray[0]}`,
  timeArray = dateTimeArray[1].split(':'),
  twentyfour = `${timeArray[0]}:${timeArray[1]}`,
  hour = parseInt(timeArray[0]),
  timeString = `${hour < 13? hour == 0? 12 : parseInt(timeArray[0]) : parseInt(timeArray[0] - 12)}:${timeArray[1]}${timeArray[0] < 12? 'a' : 'p'}m`,

  datetimeArray = datetime.split('T')[0].split('-').concat(datetime.split('T')[1].split(':')),
  utc = Date.UTC(
    datetimeArray[0],
    parseInt(datetimeArray[1])-1,
    datetimeArray[2],
    datetimeArray[3],
    datetimeArray[4]
  );

  return [dateString, timeString, utc, twentyfour, dateTimeArray[0]];
};
