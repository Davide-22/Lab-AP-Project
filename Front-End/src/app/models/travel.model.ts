export interface TravelJSON {
    name: string;
    user: string;
    description: string;
    destination: string[];
    end_date: Date;
    start_date: Date;
    daily_budget: number;
}

export class Travel {
    public name: string;
    public user: string;
    public description: string;
    public destination: string[];
    public end_date: Date;
    public start_date: Date;
    public daily_budget: number;

    public static toJSON(model: Travel): TravelJSON {
        return model as TravelJSON;
    }
}