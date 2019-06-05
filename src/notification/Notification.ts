/** Form notification banner notifying user of a form conflict. */
class Notification {
    public callback: () => void;

    private formContext: Xrm.FormContext;
    private text: string;

    constructor(text: string, formContext: Xrm.FormContext) {
        this.formContext = formContext;
        this.text = text;
        this.callback = this.getCallback();
    }

    /**
     * Sets a form notification to notify user of a form conflict.
     */
    public setFormNotification(): void {
        this.formContext.ui.setFormNotification(
            this.text,
            "INFO",
            "GetAlongNotification");
    }

    private getCallback(): () => void {
        return () => this.setFormNotification();
    }
}

export default Notification;
