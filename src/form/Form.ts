import Dialog from "../notification/Dialog";
import Notification from "../notification/Notification";
import IConfirmStrings from "../types/IConfirmStrings";
import Data from "./Data";
import Metadata from "./Metadata";

class Form {
    public data: Data;
    public notifyUserCallback: () => void;

    private dialog: Dialog;
    private formContext: Xrm.FormContext;
    private metadata: Metadata;
    private notification: Notification;

    constructor(executionContext: Xrm.Page.EventContext, showDialog?: boolean, confirmStrings?: IConfirmStrings) {
        this.formContext = executionContext.getFormContext();
        this.data = new Data(this.formContext);
        this.metadata = new Metadata(this.formContext);
        this.setDialog(showDialog, confirmStrings);
        this.setNotification(showDialog);
    }

    /**
     * Reloads the form.
     */
    public reload(): void {
        const entityId = this.formContext.data.entity.getId();
        const entityName = this.formContext.data.entity.getEntityName();

        Xrm.Navigation.openForm({ entityId, entityName });
    }

    /**
     * Prevents form attributes from being submitted when the record is saved.
     */
    public preventSave(): void {
        this.formContext.data.entity.attributes.forEach((attribute) => {
            attribute.setSubmitMode("never");
        });
    }

    /**
     * Returns true if the form type is not create or undefined.
     */
    public isValid(): boolean {
        const formType: XrmEnum.FormType = this.formContext.ui.getFormType();

        return formType !== undefined &&
            formType !== 0 &&
            formType !== 1;
    }

    private setDialog(showDialog?: boolean, confirmStrings?: IConfirmStrings): void {
        if (showDialog === true && confirmStrings !== undefined) {
            this.dialog = new Dialog(confirmStrings, this.formContext, this.metadata);
            this.notifyUserCallback = () => {
                this.preventSave();
                this.dialog.callback();
            };
        } else {
            console.error("Get Along has been configured incorrectly. Show dialog has been selected but no confirm strings have been passed.");
        }
    }

    private setNotification(showDialog?: boolean): void {
        if (showDialog === undefined || showDialog === false) {
            const notificationText = `This form has been modified by ${this.data.latestModifiedBy} at ${this.data.latestModifiedOn}. Refresh the form to see latest changes.`;
            this.notification = new Notification(notificationText, this.formContext);
            this.notifyUserCallback = () => {
                this.preventSave();
                this.notification.callback();
            };
        }
    }
}

export default Form;
