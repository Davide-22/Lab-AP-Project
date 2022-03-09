export interface GetDaysJSON {
    travel: string;
    token: string;
}

export class GetDays {
    public travel: string;
    public token: string;

    public static toJSON(model: GetDays): GetDaysJSON {
        return model as GetDaysJSON;
    }
}