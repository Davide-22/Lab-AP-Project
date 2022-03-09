export interface DailyExpenseJSON {
    travel: string;
    token: string;
    date: string;
}

export class DailyExpense{
    public travel: string;
    public token: string;
    public date: string;

    public static toJSON(model: DailyExpense): DailyExpenseJSON {
        return model as DailyExpenseJSON;
    }
}