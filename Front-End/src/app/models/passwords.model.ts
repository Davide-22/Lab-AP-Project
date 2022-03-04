
export interface PasswordsJSON {
    oldpassword: string;
    password: string;
    token: string;
}

export class Passwords {
    public oldpassword: string;
    public password: string;
    public token: string;
    
    constructor(oldpassword: string, password: string, token: string){
        this.oldpassword = oldpassword;
        this.password = password;
        this.token = token;
    }
    public static toJSON(model: Passwords): PasswordsJSON {
        return model as PasswordsJSON;
    }
    public toString = () : string => {
        return this.oldpassword + " " + this.password + " " + this.token;
    }
}