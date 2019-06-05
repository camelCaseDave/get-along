interface IUserNotification {
    /** Opens the user notification, notifying user of a conflict. */
    open(): () => void;
}

export default IUserNotification;
