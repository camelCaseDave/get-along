import IUserNotification from "../types/IUserNotification";

/** Form notification banner notifying user of a form conflict. */
class Notification implements IUserNotification {
    public isOpen: boolean = false;

    private formContext: Xrm.FormContext;
    private text: string;

    constructor(text: string, formContext: Xrm.FormContext) {
        this.formContext = formContext;
        this.text = text;
    }

    /** Opens the notification, notifying user of a conflict. */
    public open(): void {
        if (!this.isOpen) {
            this.isOpen = true;
            this.formContext.ui.setFormNotification(
                this.text,
                "INFO",
                "GetAlongNotification");
        }
    }
}

export default Notification;
