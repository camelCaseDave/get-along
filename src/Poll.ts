export default class Poll {
    public static async poll(fn, timeout: number, interval: number) {
        const endTime = Number(new Date()) + (timeout * 1000);

        const checkCondition = (resolve, reject) => {
            const callback = fn();
            callback.then(response => {
                if (response == true) {
                    resolve(response);
                }
                else if (Number(new Date()) < endTime) {
                    setTimeout(checkCondition.bind(this), interval * 1000, resolve, reject);
                }
                else {
                    reject(console.log("GetAlong has been polling for 30 minutes and will stop now."));
                }
            });
        };

        return new Promise(checkCondition);
    }
}