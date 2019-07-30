import Metadata from '../form/metadata';
import IConfirmStrings from '../types/confirm-strings';
import IUserNotification from '../types/user-notification';
import DialogUi from './dialog-ui';

/** Confirm dialog notifying user of a form conflict. */
class Dialog implements IUserNotification {
    public isOpen: boolean = false;

    private formContext: Xrm.FormContext;
    private metadata: Metadata;
    private ui: DialogUi;

    constructor(
        confirmStrings: IConfirmStrings,
        formContext: Xrm.FormContext,
        metadata: Metadata
    ) {
        this.formContext = formContext;
        this.metadata = metadata;
        this.ui = new DialogUi(confirmStrings);
    }

    /** Opens the dialog, notifying user of a conflict. */
    public open(): void {
        if (!this.isOpen) {
            this.isOpen = true;

            this.openCallback(
                () => {
                    this.metadata.preventSave(this.formContext);
                    window.parent.location.reload(false);
                },
                () => {
                    this.metadata.preventSave(this.formContext);
                    this.formContext.ui.close();
                }
            );
        }
    }

    /**
     * Opens a confirm dialog to notify user of a form conflict and prevent them from making further changes.
     */
    private openCallback(
        confirmCallback: () => void,
        cancelCallback: () => void
    ): void {
        const confirmOptions = {
            height: this.ui.defaultHeight,
            width: this.ui.defaultWidth,
        };
        const confirmStrings = this.ui.getConfirmStringsWithDefaults();

        Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
            success => {
                if (success.confirmed) {
                    confirmCallback();
                } else {
                    cancelCallback();
                }
            }
        );
    }
}

export default Dialog;
