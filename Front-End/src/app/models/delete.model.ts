export interface DeleteJSON {
    name: string;
    token: string;
}

export class Delete {
    public name: string;
    public token: string;

    public static toJSON(model: Delete): DeleteJSON {
        return model as DeleteJSON;
    }
}