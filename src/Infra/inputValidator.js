
const TEXT_FIELD_VALID_CLASS = "";
const TEXT_FIELD_INVALID_CLASS = "not-valid";

const textRulesNames = {
    REQUIRED_RULE:"required"
}

const textValidationRules = {
    required:(val) => val !== null && val !== "" && val !== undefined
}

function validateTextInput({
    rule,
    textValue
}){
    let ruleChecksOut = textValidationRules[rule](textValue);
   if(ruleChecksOut){
        return TEXT_FIELD_VALID_CLASS;
   }else{
        return TEXT_FIELD_INVALID_CLASS;
   }
}

const inputValidator = {
    validateTextInput,
    textRulesNames
};

export default inputValidator;