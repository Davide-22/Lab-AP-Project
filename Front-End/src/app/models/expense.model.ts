export interface ExpenseJSON {
    name: string;
    amount: number;
    category: string;
    place: string;
    date: string;
    travel: string;
}

export class Expense {
    public name: string;
    public amount: number;
    public category: string;
    public place: string;
    public date: string;
    public travel: string;

    public static toJSON(model: Expense): ExpenseJSON {
        return model as ExpenseJSON;
    }
}