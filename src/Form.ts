import Query from "./Query";
import Notify from "./Notify";
import GetAlong from "./GetAlong";

export default class Form {
    //private static initialModifiedOn: Date;
//
    //public static isValidForm() {
    //    const formType: XrmEnum.FormType = GetAlong.formContext.ui.getFormType();
//
    //    return formType !== undefined &&
    //        formType !== 0 &&
    //        formType !== 1;
    //}
//
    //public static async getFormModifiedOn(): Promise<Date | undefined> {
    //    let modifiedOn: Date | undefined;
    //    const modifiedOnAttribute: Xrm.Attributes.DateAttribute = GetAlong.formContext.getAttribute("modifiedon");
//
    //    if (modifiedOnAttribute) {
    //        modifiedOn = modifiedOnAttribute.getValue();
    //    } else {
    //        modifiedOn = await Query.getLatestModifiedOn(GetAlong.formContext);
    //    }
//
    //    this.initialModifiedOn = modifiedOn;
    //    return modifiedOn;
    //}
    //
    //public static async checkIfModifiedOnHasChanged(): Promise<boolean> {
    //    const latestModifiedOn = await Query.getLatestModifiedOn(GetAlong.formContext);
    //    const modifiedOnHasChanged = latestModifiedOn > this.initialModifiedOn;
//
    //    if (modifiedOnHasChanged) {
    //        Notify.setFormNotification(GetAlong.formContext);
    //    }
//
    //    return modifiedOnHasChanged;
    //}
}
