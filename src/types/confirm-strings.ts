/** Displays a confirmation dialog box containing a message and two buttons.
 *  Uses the Dynamics 365 CE Client API reference
 *  {@link https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-navigation/openconfirmdialog}
 */
interface ConfirmStrings {
    /** The subtitle to be displayed in the confirmation dialog. */
    subtitle?: string;

    /** The message to be displayed in the confirmation dialog. */
    text: string;

    /** The title to be displayed in the confirmation dialog. */
    title?: string;
}

export default ConfirmStrings;
