export interface TokenJSON {
    token: string;
}

export class Token {
    public token: string;

    public static toJSON(model: Token): TokenJSON {
        return model as TokenJSON;
    }
}