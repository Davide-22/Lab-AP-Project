export interface LoginJSON {
    email: string;
    password: string;
}

export class Login {
    public email: string;
    public password: string;
    
    public static toJSON(model: Login): LoginJSON {
        return model as LoginJSON;
    }
}