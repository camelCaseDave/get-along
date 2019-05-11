export default class Notify {
    /**
     * Notifies user of a form change.
     */
    public static setFormNotification(formContext: Xrm.FormContext): void {
        formContext.ui.setFormNotification("This form has been updated by another user, refresh the form?", "INFO", "GetAlongNotification");
    }
}