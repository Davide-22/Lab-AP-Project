export interface DayJSON {
    date: string;
}

export class Day{
    public date: string;

    public static toJSON(model: Day): DayJSON {
        return model as DayJSON;
    }
}