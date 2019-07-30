import IConfirmStrings from '../types/confirm-strings';

/** Ui of the form dialog. */
class DialogUi {
    public readonly defaultHeight: number = 200;
    public readonly defaultWidth: number = 450;
    public readonly defaultConfirmButtonLabel: string = 'Refresh';
    public readonly defaultCancelButtonLabel: string = 'Close';

    private confirmStrings: IConfirmStrings;

    constructor(confirmStrings: IConfirmStrings) {
        this.confirmStrings = confirmStrings;
    }

    public getConfirmStringsWithDefaults(): Xrm.Navigation.ConfirmStrings {
        const confirmStringsWithDefaults: Xrm.Navigation.ConfirmStrings = {
            cancelButtonLabel: this.defaultCancelButtonLabel,
            confirmButtonLabel: this.defaultConfirmButtonLabel,
            subtitle: this.confirmStrings.subtitle,
            text: this.confirmStrings.text,
            title: this.confirmStrings.title,
        };

        return confirmStringsWithDefaults;
    }
}

export default DialogUi;
