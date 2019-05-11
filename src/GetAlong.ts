import Poll from "./Poll";
import Query from "./Query";
import Notify from "./Notify";

export default class GetAlong {   
    private static formContext: Xrm.FormContext;
    private static initialModifiedOn: Date;

    public static async pollForModifications(executionContext: Xrm.Page.EventContext, timeout: number) {
        this.formContext = executionContext.getFormContext();

        if (!this.isValidForm()) {
            return;
        }

        await this.getFormModifiedOn();        
        
        Poll.poll(() => this.checkIfModifiedOnHasChanged(), 1800 / timeout, timeout);
    }

    private static isValidForm() {
        const formType: XrmEnum.FormType = GetAlong.formContext.ui.getFormType();

        return formType !== undefined &&
            formType !== 0 &&
            formType !== 1;
    }

    private static async getFormModifiedOn(): Promise<Date | undefined> {
        let modifiedOn: Date | undefined;
        const modifiedOnAttribute: Xrm.Attributes.DateAttribute = GetAlong.formContext.getAttribute("modifiedon");

        if (modifiedOnAttribute) {
            modifiedOn = modifiedOnAttribute.getValue();
        } else {
            modifiedOn = await Query.getLatestModifiedOn(GetAlong.formContext);
        }

        this.initialModifiedOn = modifiedOn;
        return modifiedOn;
    }
    
    private static async checkIfModifiedOnHasChanged(): Promise<boolean> {
        const latestModifiedOn = await Query.getLatestModifiedOn(GetAlong.formContext);
        const modifiedOnHasChanged = latestModifiedOn > this.initialModifiedOn;

        if (modifiedOnHasChanged) {
            Notify.setFormNotification(GetAlong.formContext);
        }

        return modifiedOnHasChanged;
    }
}