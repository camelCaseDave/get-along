/** Interacts directly with the Xrm Web API. */
class Query {
    /**
     * Calls CRM API and returns the given entity's modified on date.
     * @param entityName schema name of the entity to query.
     * @param entityId id of the entity to query.
     */
    public static async getLatestModifiedOn(
        formContext: Xrm.FormContext,
        entityName?: string,
        entityId?: string
    ): Promise<any> {
        this.entityId =
            this.entityId || entityId || formContext.data.entity.getId();
        this.entityName =
            this.entityName ||
            entityName ||
            formContext.data.entity.getEntityName();

        return Xrm.WebApi.retrieveRecord(
            this.entityName,
            this.entityId,
            '?$select=modifiedon&$expand=modifiedby($select=fullname)'
        ).then(response => {
            return response;
        });
    }

    private static entityId: string;
    private static entityName: string;
}

export default Query;
