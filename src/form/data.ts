import Processor from "../data/processor";
import Query from "../data/query";

/** Data of the record in CRM. */
class Data {
    public initialModifiedOn: Date | undefined;
    public latestModifiedOn: string;
    public latestModifiedBy: string;

    private formContext: Xrm.FormContext;

    constructor(formContext: Xrm.FormContext) {
        this.formContext = formContext;
        this.addResetOnSave();
    }

    /**
     * Gets the form modified on date. Calls CRM API if modified on attribute is not on the form.
     */
    public async getModifiedOn(): Promise<Date | undefined> {
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
     * Gets modified on from CRM server. Returns true if it has changed, and notifies the user.
     */
    public async checkIfModifiedOnHasChanged(notificationCallback: () => void): Promise<boolean> {
        this.initialModifiedOn = this.initialModifiedOn || await this.getModifiedOn();

        const apiResponse = await Query.getLatestModifiedOn(this.formContext);
        this.cacheApiResponse(apiResponse);

        const modifiedOnHasChanged = apiResponse.modifiedon &&
            (new Date(apiResponse.modifiedon) > new Date(this.initialModifiedOn!))
            ? true : false;

        if (modifiedOnHasChanged && notificationCallback) {
            notificationCallback();
        }

        return modifiedOnHasChanged;
    }

    /**
     * Resets modified on cache when form is saved.
     */
    private addResetOnSave(): void {
        this.formContext.data.entity.addOnSave(() => {
            this.initialModifiedOn = undefined;
        });
    }

    private cacheApiResponse(apiResponse: any): void {
        this.latestModifiedBy = Processor.processModifiedByUser(apiResponse);
        this.latestModifiedOn = Processor.processModifiedOnDate(apiResponse);
    }
}

export default Data;