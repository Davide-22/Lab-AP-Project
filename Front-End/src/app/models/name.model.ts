export interface NameJSON {
    name: string;
}

export class Name {
    public name: string;

    public static toJSON(model: Name): NameJSON {
        return model as NameJSON;
    }
}