export type User = {
    name: string;
    email: string;
    rfid_uid: string;
    role: 'admin' | 'user' | 'guest';
    active: boolean;
}