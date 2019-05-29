export default class Processor {
    /**
     * Returns modifiedon date as a readable, user locale string.
     * @param apiResponse CRM API response that includes "modifiedon" column.
     */
    public static processModifiedOnDate(apiResponse): string {
        const modifiedOnDate = (apiResponse && apiResponse.modifiedon)
            ? new Date(apiResponse.modifiedon).toLocaleString()
            : "the same time";

        return modifiedOnDate;
    }

    /**
     * Returns modified by user's full name.
     * @param apiResponse CRM API response that includes expanded "modifiedby.fullname" column.
     */
    public static processModifiedByUser(apiResponse): string {
        const modifiedByUser = (apiResponse && apiResponse.modifiedby && apiResponse.modifiedby.fullname)
            ? apiResponse.modifiedby.fullname
            : "another user";

        return modifiedByUser;
    }
}
