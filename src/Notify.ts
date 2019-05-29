export default class Notify {
    /**
     * Notifies user of a form change.
     */
    public static setFormNotification(formContext: Xrm.FormContext, modifiedOn: string, modifiedBy: string): void {
        formContext.ui.setFormNotification(
            `This form has been modified by ${modifiedBy} at ${modifiedOn}. Refresh the form to see latest changes.`,
            "INFO",
            "GetAlongNotification");
    }
}
