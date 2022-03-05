export interface EmailJSON {
    email: string;
}

export class Email {
    public email: string;

    public static toJSON(model: Email): EmailJSON {
        return model as EmailJSON;
    }
}