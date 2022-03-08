export interface DailyExpenseJSON {
    name: string;
    date: string;
}

export class DailyExpense{
    public name: string; //nome del travel
    public date: string;

    public static toJSON(model: DailyExpense): DailyExpenseJSON {
        return model as DailyExpenseJSON;
    }
}