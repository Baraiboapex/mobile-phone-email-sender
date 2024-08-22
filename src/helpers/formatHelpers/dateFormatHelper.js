import dayjs from "dayjs";

const DATE_FORMAT_STRING = "MM/D/YYYY";

export function formatNormalDate(dateToFormat){
    return dayjs(dateToFormat).format(DATE_FORMAT_STRING ).toString();
}

export function formatDateTimeAsPhrase({
    dateToFormat, 
    timeToFormat, 
    joiningWord
}){
    const date = dayjs(dateToFormat).format(DATE_FORMAT_STRING);
    const time = timeToFormat;
    const completedPhraseString = date + " " + joiningWord + " " + time; 

    return completedPhraseString;
}
