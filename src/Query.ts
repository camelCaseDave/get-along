export default class Query {
    private static entityId: string;
    private static entityName: string;

    public static async getLatestModifiedOn(formContext: Xrm.FormContext, entityName?: string, entityId?: string): Promise<Date> {
        this.entityId = this.entityId || entityId || formContext.data.entity.getId();
        this.entityName = this.entityName || entityName || formContext.data.entity.getEntityName();

        return Xrm.WebApi.retrieveRecord(this.entityName, this.entityId, "?$select=modifiedon").then(response => {
            return response.modifiedon;
        });
    }
}