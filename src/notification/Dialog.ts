import Metadata from "../form/Metadata";
import IConfirmStrings from "../types/IConfirmStrings";
import DialogUi from "./DialogUi";

/** Confirm dialog notifying user of a form conflict. */
class Dialog {
    public callback: () => void;

    private confirmStrings: IConfirmStrings;
    private ui: DialogUi;

    constructor(confirmStrings: IConfirmStrings, formContext: Xrm.FormContext, metadata: Metadata) {
        this.confirmStrings = confirmStrings;
        this.ui = new DialogUi();
        this.callback = this.getCallback(formContext, metadata);
    }

    /**
     * Opens a confirm dialog to notify user of a form conflict and prevent them from making further changes.
     */
    public open(confirmCallback: () => void, cancelCallback: () => void): void {
        const confirmOptions = { height: this.ui.defaultHeight, width: this.ui.defaultWidth };
        const confirmStrings = this.getConfirmStringsWithDefaults();

        Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then((success) => {
            if (success.confirmed) {
                confirmCallback();
            } else {
                cancelCallback();
            }
        });
    }

    private getCallback(formContext: Xrm.FormContext, metadata: Metadata): () => void {
        return () => this.open(() => {
            Xrm.Navigation.openForm({ entityId: metadata.entityId, entityName: metadata.entityName });
        }, () => {
            formContext.ui.close();
        });
    }

    private getConfirmStringsWithDefaults(): Xrm.Navigation.ConfirmStrings {
        const confirmStringsWithDefaults: Xrm.Navigation.ConfirmStrings = {
            cancelButtonLabel: this.ui.defaultCancelButtonLabel,
            confirmButtonLabel: this.ui.defaultConfirmButtonLabel,
            subtitle: this.confirmStrings.subtitle,
            text: this.confirmStrings.text,
            title: this.confirmStrings.title,
        };

        return confirmStringsWithDefaults;
    }
}

export default Dialog;
