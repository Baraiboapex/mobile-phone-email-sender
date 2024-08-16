import _ from "lodash";

export function addSpaceBeforeCapitalLetters(stringToConvert){
    const regex = /([A-Z])/g;
    return _.replace(stringToConvert, regex, " $1");
}

export function removeSpacingInString(stringToConvert){
    return stringToConvert.replace(" ","");
}