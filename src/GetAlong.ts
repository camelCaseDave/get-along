import Poll from "./data/Poll";
import Form from "./form/Form";
import Dialog from "./notification/Dialog";
import Notification from "./notification/Notification";
import IGetAlongConfig from "./types/IGetAlongConfig";
import IUserNotification from "./types/IUserNotification";

/** Notifies users when a record they're viewing is modified elsewhere. */
class GetAlong {
    /**
     * Loads Get Along, polls for conflicts and notifies the user if any are found.
     * @param executionContext passed by default from Dynamics CRM form.
     * @param timeout duration in seconds to timeout between poll operations.
     */
    public static async pollForConflicts(executionContext: Xrm.Page.EventContext, config: IGetAlongConfig): Promise<void> {
        try {
            this.handleConfig(config);
            this.form = new Form(executionContext);

            if (!this.form.isValid()) {
                return;
            }

            await this.form.data.getModifiedOn();
            await Poll.poll(() => this.form.data.checkIfModifiedOnHasChanged(this.userNotification.open), 1800 / config.timeout, config.timeout);
        } catch (e) {
            console.error(`getalong.js has encountered an error. ${e}`);
        }
    }

    /** Checks for conflicts and notifies the user if any are found. */
    public static async checkForConflicts(): Promise<void> {
        try {
            this.form.data.checkIfModifiedOnHasChanged(this.userNotification.open);
        } catch (e) {
            console.error(`getalong.js has encountered an error. ${e}`);
        }
    }

    private static form: Form;
    private static userNotification: IUserNotification;

    private static handleConfig(config: IGetAlongConfig) {
        if (config.confirmDialog === undefined || config.confirmDialog === false) {
            this.userNotification = this.handleNotification();
        } else if (config.confirmDialog === true && config.confirmStrings !== undefined) {
            this.userNotification = this.handleDialog(config);
        } else {
            console.error("Get Along has been configured incorrectly. Show dialog has been selected but no confirm strings have been passed.");
        }
    }

    private static handleNotification(): Notification {
        const notificationText = `This form has been modified by ${this.form.data.latestModifiedBy} at ${this.form.data.latestModifiedOn}. Refresh the form to see latest changes.`;
        return new Notification(notificationText, this.form.formContext);
    }

    private static handleDialog(config: IGetAlongConfig): Dialog {
        return new Dialog(config.confirmStrings!, this.form.formContext, this.form.metadata);
    }
}

export default GetAlong;
