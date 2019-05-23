export const handleRecaptcha = e => {
  let userDay = e.target.value.toLowerCase();
  let dayCount;

  if (userDay === "sunday") {
    dayCount = 0;
  } else if (userDay === "monday") {
    dayCount = 1;
  } else if (userDay === "tuesday") {
    dayCount = 2;
  } else if (userDay === "wednesday") {
    dayCount = 3;
  } else if (userDay === "thursday") {
    dayCount = 4;
  } else if (userDay === "friday") {
    dayCount = 5;
  } else if (userDay === "saturday") {
    dayCount = 6;
  }

  if (dayCount === new Date().getDay()) {
    return true;
  } else {
    return false;
  }
};
