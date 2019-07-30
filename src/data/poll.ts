import MESSAGES from '../config/messages';

/** Handles function calls at a set time interval. */
class Poll {
    /*
     * True if poll is active, otherwise false.
     */
    public enabled: boolean;
    /**
     * Polls a function every specified number of seconds until it returns true or timeout is reached.
     * @param fn callback Promise to poll.
     * @param timeout seconds to continue polling for.
     * @param interval seconds between polling calls.
     */
    public static async poll(
        fn: any,
        timeout: number,
        interval: number
    ): Promise<any> {
        const endTime = Number(new Date()) + timeout * 1000;

        const checkCondition = (resolve, reject) => {
            const callback = fn();

            callback.then(response => {
                if (response === true) {
                    resolve(response);
                } else if (Number(new Date()) < endTime) {
                    setTimeout(
                        checkCondition.bind(this),
                        interval * 1000,
                        resolve,
                        reject
                    );
                } else {
                    reject(console.log(MESSAGES.pollingTimeout));
                }
            });
        };

        return new Promise(checkCondition);
    }
}

export default Poll;
