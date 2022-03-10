export interface CompleteJSON {
    travel: string;
    userToken: string;
    date: string;
}

export class Complete{
    public travel: string;
    public userToken: string;
    public date: string;

    public static toJSON(model: Complete): CompleteJSON {
        return model as CompleteJSON;
    }
}