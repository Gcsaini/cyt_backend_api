export const getTimeDifferenceInSeconds = (dateString) => {
  // Parse the given date string into a Date object
  const givenDate = new Date(dateString);

  // Get the current time as a Date object
  const currentDate = new Date();

  // Get the time in milliseconds for each date
  const givenTimeMillis = givenDate.getTime();
  const currentTimeMillis = currentDate.getTime();

  // Calculate the difference in milliseconds
  const differenceInMillis = currentTimeMillis - givenTimeMillis;

  // Convert the difference from milliseconds to seconds
  const differenceInSeconds = Math.floor(differenceInMillis / 1000);

  return differenceInSeconds;
};
