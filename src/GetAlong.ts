import Form from "./Form";

export default class GetAlong {
    // if form type is not create
    // on load cache modified on
    // periodically query
    // get same record by id, where modified on greater than cached value
    // notify user: modified on x by y. button to refresh form and clear cache
    private static formLastModified: Date | undefined;

    public static async pollForUpdates(executionContext: Xrm.FormContext, timeout: number) {
        if (Form.isValidForm(executionContext)) {
            this.formLastModified = this.formLastModified || await Form.getFormModifiedOn(executionContext);

            
        }
    }    
}