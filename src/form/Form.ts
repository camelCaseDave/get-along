import Data from "./Data";
import Metadata from "./Metadata";

/** A form in Dynamics 365 CE. */
class Form {
    public data: Data;
    public formContext: Xrm.FormContext;
    public metadata: Metadata;

    constructor(executionContext: Xrm.Page.EventContext) {
        this.formContext = executionContext.getFormContext();
        this.data = new Data(this.formContext);
        this.metadata = new Metadata(this.formContext);
    }

    /**
     * Reloads the form.
     */
    public reload(): void {
        const entityId = this.formContext.data.entity.getId();
        const entityName = this.formContext.data.entity.getEntityName();

        Xrm.Navigation.openForm({ entityId, entityName });
    }

    /**
     * Returns true if the form type is not create or undefined.
     */
    public isValid(): boolean {
        const formType: XrmEnum.FormType = this.formContext.ui.getFormType();

        return formType !== undefined &&
            formType !== 0 &&
            formType !== 1;
    }
}

export default Form;
