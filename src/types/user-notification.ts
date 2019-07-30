interface UserNotification {
    /** True if the user notification is open. */
    isOpen: boolean;

    /** Opens the user notification, notifying user of a conflict. */
    open(): void;
}

export default UserNotification;
