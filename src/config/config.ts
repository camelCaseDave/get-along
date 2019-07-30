import Form from "../form/form";
import Dialog from "../notification/dialog";
import Notification from "../notification/notification";
import IGetAlongConfig from "../types/get-along-config";
import IUserNotification from "../types/user-notification";
import ConfigValidator from "./config-validator";

class Config {
    private config: IGetAlongConfig;
    private form: Form;

    constructor(config: IGetAlongConfig, form: Form) {
        this.config = this.parseConfig(config);
        this.form = form;
    }

    /** Derives the user notification, either a form notification or a dialog, from config passed from the CRM form properties. */
    public getUserNotification(): IUserNotification {
        const isUseDialogSelected = this.config.confirmDialog === true && this.config.confirmStrings !== undefined;
        const userNotification = isUseDialogSelected ? this.getDialog() : this.getNotification();

        return userNotification;
    }

    /** Returns true if the config passed from the CRM form properties is valid for use, otherwise false. */
    public isValid(): boolean {
        const validator = new ConfigValidator(this.config);
        const isValid = validator.isValid();

        return isValid;
    }

    private getNotification(): Notification {
        return new Notification(this.form);
    }

    private getDialog(): Dialog {
        return new Dialog(this.config.confirmStrings!, this.form.formContext, this.form.metadata);
    }

    private parseConfig(config: IGetAlongConfig): IGetAlongConfig {
        if (typeof config === "number") {
            return {
                timeout: config,
            };
        } else {
            return config;
        }
    }
}

export default Config;
