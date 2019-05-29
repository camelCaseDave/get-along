import Notify from "./Notify";
import Processor from "./Processor";
import Query from "./Query";

export default class Form {
    public formContext: Xrm.FormContext;
    public initialModifiedOn: Date | undefined;
    public latestModifiedOn: string;
    public latestModifiedBy: string;

    constructor(formContext: Xrm.FormContext) {
        this.formContext = formContext;
    }

    /**
     * Returns true if the form type is not create or undefined.
     */
    public isValidForm(): boolean {
        const formType: XrmEnum.FormType = this.formContext.ui.getFormType();

        return formType !== undefined &&
            formType !== 0 &&
            formType !== 1;
    }

    /**
     * Gets the form modified on date. Calls CRM API if modified on attribute is not on the form.
     */
    public async getFormModifiedOn(): Promise<Date | undefined> {
        let modifiedOn: Date | undefined;
        const modifiedOnAttribute: Xrm.Attributes.DateAttribute = this.formContext.getAttribute("modifiedon");

        if (modifiedOnAttribute) {
            modifiedOn = modifiedOnAttribute.getValue();
        } else {
            const apiResponse = await Query.getLatestModifiedOn(this.formContext);
            modifiedOn = apiResponse.modifiedon;
        }

        this.initialModifiedOn = modifiedOn;
        return modifiedOn;
    }

    /**
     * Gets modified on from CRM server and returns true if it has changed.
     */
    public async checkIfModifiedOnHasChanged(): Promise<boolean> {
        this.initialModifiedOn = this.initialModifiedOn || await this.getFormModifiedOn();

        const apiResponse = await Query.getLatestModifiedOn(this.formContext);
        this.latestModifiedBy = Processor.processModifiedByUser(apiResponse);
        this.latestModifiedOn = Processor.processModifiedOnDate(apiResponse);

        const modifiedOnHasChanged = apiResponse.modifiedon && (apiResponse.modifiedon > this.initialModifiedOn!)
            ? true : false;

        if (modifiedOnHasChanged) {
            Notify.setFormNotification(this.formContext, this.latestModifiedOn, this.latestModifiedBy);
        }

        return modifiedOnHasChanged;
    }

    /**
     * Resets modified on cache when form is saved.
     */
    public addResetOnSave(): void {
        this.formContext.data.entity.addOnSave(() => {
            this.initialModifiedOn = undefined;
        });
    }
}
