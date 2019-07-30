import Processor from '../data/processor';
import Query from '../data/query';
import Poll from '../data/poll';

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
     * Asynchronously initialises data, caching initial modified on.
     */
    public async init(): Promise<void> {
        const apiResponse = await Query.getLatestModifiedOn(this.formContext);
        this.cacheApiResponse(apiResponse);

        this.initialModifiedOn = apiResponse.modifiedon;
        Poll.enabled = true;
    }

    /**
     * Gets modified on from CRM server. Returns true if it has changed, and notifies the user.
     */
    public async checkIfModifiedOnHasChanged(
        notificationCallback: () => void
    ): Promise<boolean> {
        if (!this.initialModifiedOn) {
            await this.init();
            return false;
        }

        const apiResponse = await Query.getLatestModifiedOn(this.formContext);

        const modifiedOnHasChanged =
            apiResponse.modifiedon &&
            new Date(apiResponse.modifiedon) > new Date(this.initialModifiedOn!)
                ? true
                : false;

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
