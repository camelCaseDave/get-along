class Metadata {
    public entityId: string;
    public entityName: string;

    constructor(formContext: Xrm.FormContext) {
        this.entityId = formContext.data.entity.getId();
        this.entityName = formContext.data.entity.getEntityName();
    }
}

export default Metadata;
