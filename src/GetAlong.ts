import Form from "./form/Form";
import Poll from "./Poll";
import IGetAlongConfig from "./types/IGetAlongConfig";

/** Notifies users when a record they're viewing is modified elsewhere. */
class GetAlong {
    /**
     * Loads Get Along.
     * @param executionContext passed by default from Dynamics CRM form.
     * @param timeout duration in seconds to timeout between poll operations.
     */
    public static async load(executionContext: Xrm.Page.EventContext, config: IGetAlongConfig): Promise<void> {
        try {
            this.config = config;
            this.executionContext = executionContext;
            this.form = new Form(this.executionContext, config.confirmDialog, config.confirmStrings);

            if (!this.form.isValid()) {
                return;
            }

            await this.form.data.getModifiedOn();
            await this.pollForModifications(this.form.notifyUserCallback);

        } catch (e) {
            console.error(`getalong.js has encountered an error. ${e}`);
        }
    }

    private static config: IGetAlongConfig;
    private static executionContext: Xrm.Page.EventContext;
    private static form: Form;

    /**
     * Polls for modifications to the current form.
     * @param executionContext passed by default from Dynamics CRM form.
     * @param timeout duration in seconds to timeout between poll operations.
     */
    private static async pollForModifications(notificationCallback: () => void): Promise<void> {
        Poll.poll(() => this.form.data.checkIfModifiedOnHasChanged(notificationCallback), 1800 / this.config.timeout, this.config.timeout);
    }
}

export default GetAlong;
