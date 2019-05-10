import Query from "./Query";

export default class Form {
    public static isValidForm(executionContext: Xrm.FormContext) {
        const formType: XrmEnum.FormType = executionContext.ui.getFormType();

        return formType != undefined &&
               formType != XrmEnum.FormType.Undefined &&
               formType != XrmEnum.FormType.Create;
    }

    public static async getFormModifiedOn(executionContext: Xrm.FormContext): Promise<Date | undefined> {
        let modifiedOn: Date | undefined;
        const modifiedOnAttribute: Xrm.Attributes.DateAttribute = executionContext.getAttribute("modifiedon");

        if (modifiedOnAttribute) {
            modifiedOn = modifiedOnAttribute.getValue();
        } else {
            modifiedOn = await Query.getLastModifiedOn(executionContext);
        }

        return modifiedOn;
    }
}