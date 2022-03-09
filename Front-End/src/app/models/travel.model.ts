export interface TravelJSON {
    name: string;
    user: string;
    description: string;
    destination: string[];
    end_date: string;
    start_date: string;
    daily_budget: number;
}

export class Travel {
    public name: string;
    public user: string;
    public description: string;
    public destination: string[];
    public end_date: string;
    public start_date: string;
    public daily_budget: number;

    public static toJSON(model: Travel): TravelJSON {
        return model as TravelJSON;
    }
}