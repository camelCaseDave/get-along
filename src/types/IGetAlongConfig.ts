import IConfirmStrings from "./IConfirmStrings";

/** Configuration passed from the Dynamics 365 form to make GetAlong run. */
interface IGetAlongConfig {
    /** Duration in seconds to timeout between poll operations. */
    timeout: number;

    /** True to show a confirm dialog when a conflict is found, otherwise shows a form notification. False by default. */
    confirmDialog?: boolean;

    /** Required if {@param confirmDialog is true}. The strings to be used in the confirmation dialog. */
    confirmStrings?: IConfirmStrings;
}

export default IGetAlongConfig;
