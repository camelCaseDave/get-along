import IGetAlongConfig from '../types/get-along-config';
import MESSAGES from './messages';

/** Validates the config passed by CRM form properties. */
class ConfigValidator {
    private config: IGetAlongConfig;
    private validationRules: Array<() => boolean>;

    constructor(config: IGetAlongConfig) {
        this.config = config;
        this.validationRules = [
            this.configIsDefined.bind(this),
            this.dialogSettingsAreValid.bind(this),
            this.timeoutIsDefined.bind(this),
            this.timeoutIsValid.bind(this),
        ];
    }

    /** Returns true if the config is valid, otherwise false. */
    public isValid(): boolean {
        const isValid = this.validationRules.every(
            (fn: () => boolean) => fn() === true
        );
        return isValid;
    }

    private configIsDefined(): boolean {
        if (this.config !== undefined) {
            return true;
        } else {
            console.error(MESSAGES.configNotSpecified);
            return false;
        }
    }

    private dialogSettingsAreValid(): boolean {
        if (
            this.config.confirmDialog === true &&
            this.config.confirmStrings === undefined
        ) {
            console.error(MESSAGES.confirmStringsNotSpecified);
            return false;
        } else {
            return true;
        }
    }

    private timeoutIsDefined(): boolean {
        if (this.config.timeout !== undefined) {
            return true;
        } else {
            console.error(MESSAGES.timeoutNotSpecified);
            return false;
        }
    }

    private timeoutIsValid(): boolean {
        if (this.config.timeout < 1 || this.config.timeout >= 1800) {
            console.error(MESSAGES.timeoutOutsideValidRange);
            return false;
        } else {
            return true;
        }
    }
}

export default ConfigValidator;
