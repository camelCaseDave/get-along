/** Record metadata used to query the CRM API. */
class Metadata {
    public entityId: string;
    public entityName: string;

    constructor(formContext: Xrm.FormContext) {
        this.entityId = formContext.data.entity.getId();
        this.entityName = formContext.data.entity.getEntityName();
    }

    /**
     * Prevents form attributes from being submitted when the record is saved.
     */
    public preventSave(formContext: Xrm.FormContext): void {
        formContext.data.entity.attributes.forEach((attribute) => {
            attribute.setSubmitMode("never");
        });
    }
}

export default Metadata;
