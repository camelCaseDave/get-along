import IUserNotification from '../types/user-notification';
import Form from '../form/form';
import Data from '../form/data';

/** Form notification banner notifying user of a form conflict. */
class Notification implements IUserNotification {
    public isOpen: boolean = false;

    private data: Data;
    private formContext: Xrm.FormContext;

    constructor(form: Form) {
        this.data = form.data;
        this.formContext = form.formContext;
    }

    /** Opens the notification, notifying user of a conflict. */
    public open(): void {
        if (!this.isOpen) {
            this.isOpen = true;
            this.formContext.ui.setFormNotification(
                this.getNotificationText(),
                'INFO',
                'GetAlongNotification'
            );
        }
    }

    private getNotificationText(): string {
        const text = `This form has been modified by ${this.data.latestModifiedBy} at ${this.data.latestModifiedOn}. Refresh the form to see latest changes.`;
        return text;
    }
}

export default Notification;
