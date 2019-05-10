export default class Query {
    public static async getLastModifiedOn(executionContext: Xrm.FormContext, entityName?: string, entityId?: string): Promise<Date> {
        entityId = entityId || executionContext.data.entity.getId();
        entityName = entityName || executionContext.data.entity.getEntityName();

        return Xrm.WebApi.retrieveRecord(entityName, entityId, "?$select=modifiedon").then(response => {
            return response.modifiedon;
        });
    }
}