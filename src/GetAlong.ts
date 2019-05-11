import Poll from "./Poll";
import Form from "./Form";

export default class GetAlong {
    private static form: Form;

    /**
     * Polls for modifications to the current form.
     * @param executionContext passed by default from Dynamics CRM form.
     * @param timeout duration in seconds to timeout between poll operations.
     */
    public static async pollForModifications(executionContext: Xrm.Page.EventContext, timeout: number): Promise<void> {
        try {
            const formContext = executionContext.getFormContext();
            this.form = new Form(formContext);

            if (!this.form.isValidForm()) {
                return;
            }

            await this.form.getFormModifiedOn();
            this.form.addResetOnSave();

            Poll.poll(() => this.form.checkIfModifiedOnHasChanged(), 1800 / timeout, timeout);
        } catch (e) {
            console.error(`getalong.js has encountered an error. ${e}`);
        }
    }
}