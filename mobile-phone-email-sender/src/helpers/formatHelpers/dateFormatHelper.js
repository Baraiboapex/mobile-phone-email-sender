import dayjs from "dayjs";

const DATE_FORMAT_STRING = "DD/MM/YYYY";
const TIME_FORMAT_STRING = "hh:mm";
const MONTH_FORMAT_STRING = "MM";
const DAY_FORMAT_STRING = "dd";
const YEAR_FORMAT_STRING = "YYYY";

function formatTime(timeToFormat){
    return dayjs(timeToFormat).format(TIME_FORMAT_STRING);
}

function formatMonth(monthToFormat){
    return dayjs(monthToFormat).format(MONTH_FORMAT_STRING);
}

function formatDay(dayToFormat){
    return dayjs(dayToFormat).format(DAY_FORMAT_STRING);
}

function formatYear(yearToFormat){
    return dayjs(yearToFormat).format(DAY_FORMAT_STRING);
}

function formatNormalDate(dateToFormat){
    return dayjs(dateToFormat).format(YEAR_FORMAT_STRING).toString();
}

function formatDateTimeAsPhrase({
    dateToFormat, 
    timeToFormat, 
    joiningWord
}){
    const date = dayjs(dateToFormat).format(DATE_FORMAT_STRING);
    const time = dayjs(timeToFormat).format(TIME_FORMAT_STRING);
    const completedPhraseString = date + " " + joiningWord + " " + time; 

    return completedPhraseString;
}

export default {
    formatNormalDate,
    formatDateTimeAsPhrase,
    formatTime,
    formatMonth,
    formatDay,
    formatYear
};