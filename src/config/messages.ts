const projectName = 'getalong.js';
const configIsInvalid = `${projectName} config is invalid.`;

const MESSAGES = {
    configIsInvalid: `${configIsInvalid} and therefore won't load`,
    configNotSpecified: `${configIsInvalid} No config has been specified.`,
    confirmStringsNotSpecified: `${configIsInvalid} Use dialog has been selected but no confirm strings have been passed.`,
    formIsInvalid: `${projectName} thinks the form is invalid and therefore won't load`,
    generic: `${projectName} has encountered an error.`,
    pollingDisabled: `${projectName} has been disabled and will stop now.`,
    pollingTimeout: `${projectName} has been polling for 30 minutes and will stop now.`,
    timeoutNotSpecified: `${configIsInvalid} No timeout has been specified.`,
    timeoutOutsideValidRange: `${configIsInvalid} Timeout is outside of valid range.`,
};

export default MESSAGES;
