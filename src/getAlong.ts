import Config from "./config/config";
import MESSAGES from "./config/messages";
import Poll from "./data/poll";
import Form from "./form/form";
import IGetAlongConfig from "./types/IGetAlongConfig";
import IUserNotification from "./types/IUserNotification";

/**
 * Notifies users when a record they're viewing is modified elsewhere.
 */
class GetAlong {
    /** Checks for conflicts and notifies the user if any are found. */
    public static async checkForConflicts(executionContext: Xrm.Page.EventContext, config: IGetAlongConfig): Promise<void> {
        try {
            const successfulInit: boolean = await GetAlong.init(executionContext, config);

            if (!successfulInit) {
                return;
            }

            GetAlong.form.data.checkIfModifiedOnHasChanged(GetAlong.userNotification.open.bind(GetAlong.userNotification));
        } catch (e) {
            console.error(`${MESSAGES.generic} ${e}`);
        }
    }

    /**
     * Polls for conflicts and notifies the user if any are found.
     * @param executionContext passed by default from Dynamics CRM form.
     * @param timeout duration in seconds to timeout between poll operations.
     */
    public static async pollForConflicts(executionContext: Xrm.Page.EventContext, config: IGetAlongConfig): Promise<void> {
        try {
            const successfulInit: boolean = await GetAlong.init(executionContext, config);

            if (!successfulInit) {
                return;
            }

            await Poll.poll(() => this.form.data.checkIfModifiedOnHasChanged(GetAlong.userNotification.open.bind(GetAlong.userNotification)), 1800 / config.timeout, config.timeout);
        } catch (e) {
            console.error(`${MESSAGES.generic} ${e}`);
        }
    }

    private static config: Config;
    private static form: Form;
    private static userNotification: IUserNotification;

    /** Initialises Get Along. Returns true if successful, otherwise false. */
    private static async init(executionContext: Xrm.Page.EventContext, config: IGetAlongConfig): Promise<boolean> {
        GetAlong.form = GetAlong.form || new Form(executionContext);
        await GetAlong.form.init();

        if (!GetAlong.form.isValid()) {
            console.log(MESSAGES.formIsInvalid);

            return false;
        }

        GetAlong.config = GetAlong.config || new Config(config, GetAlong.form);

        if (!GetAlong.config.isValid()) {
            console.log(MESSAGES.configIsInvalid);

            return false;
        }

        GetAlong.userNotification = GetAlong.userNotification || GetAlong.config.getUserNotification();
        return true;
    }
}

export default GetAlong;
