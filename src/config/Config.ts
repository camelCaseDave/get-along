import Form from "../form/Form";
import Dialog from "../notification/Dialog";
import Notification from "../notification/Notification";
import IGetAlongConfig from "../types/IGetAlongConfig";
import IUserNotification from "../types/IUserNotification";
import ConfigValidator from "./ConfigValidator";

class Config {
    private config: IGetAlongConfig;
    private form: Form;

    constructor(config: IGetAlongConfig, form: Form) {
        this.config = config;
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
        const notificationText = `This form has been modified by ${this.form.data.latestModifiedBy} at ${this.form.data.latestModifiedOn}. Refresh the form to see latest changes.`;
        return new Notification(notificationText, this.form.formContext);
    }

    private getDialog(): Dialog {
        return new Dialog(this.config.confirmStrings!, this.form.formContext, this.form.metadata);
    }
}

export default Config;
