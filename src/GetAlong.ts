import Config from "./config/Config";
import MESSAGES from "./config/Messages";
import Poll from "./data/Poll";
import Form from "./form/Form";
import IGetAlongConfig from "./types/IGetAlongConfig";
import IUserNotification from "./types/IUserNotification";

/** Notifies users when a record they're viewing is modified elsewhere. */
class GetAlong {
    /**
     * Polls for conflicts and notifies the user if any are found.
     * @param executionContext passed by default from Dynamics CRM form.
     * @param timeout duration in seconds to timeout between poll operations.
     */
    public static async pollForConflicts(executionContext: Xrm.Page.EventContext, config: IGetAlongConfig): Promise<void> {
        try {
            this.init(executionContext, config);

            await this.form.data.getModifiedOn();
            await Poll.poll(() => this.form.data.checkIfModifiedOnHasChanged(this.userNotification.open.bind(this.userNotification)), 1800 / config.timeout, config.timeout);
        } catch (e) {
            console.error(`${MESSAGES.generic} ${e}`);
        }
    }

    /** Checks for conflicts and notifies the user if any are found. */
    public static async checkForConflicts(executionContext: Xrm.Page.EventContext, config: IGetAlongConfig): Promise<void> {
        try {
            this.init(executionContext, config);

            this.form.data.checkIfModifiedOnHasChanged(this.userNotification.open);
        } catch (e) {
            console.error(`${MESSAGES.generic} ${e}`);
        }
    }

    private static config: Config;
    private static form: Form;
    private static userNotification: IUserNotification;

    /** Initialises Get Along */
    private static init(executionContext: Xrm.Page.EventContext, config: IGetAlongConfig): void {
        this.form = this.form || new Form(executionContext);
        this.config = this.config || new Config(config, this.form);

        if (!this.form.isValid()) {
            console.log(MESSAGES.formIsInvalid);
            return;
        }

        if (!this.config.isValid()) {
            console.log(MESSAGES.configIsInvalid);
            return;
        }

        this.userNotification = this.userNotification || this.config.getUserNotification();
    }
}

export default GetAlong;
