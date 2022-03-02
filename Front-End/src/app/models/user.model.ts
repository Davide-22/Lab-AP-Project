export interface UserJSON {
    username: string;
    password: string;
    email: string;
}

export class User {
    public username: string;
    public password: string;
    public email: string;

    public static toJSON(model: User): UserJSON {
        return model as UserJSON;
    }
}