export interface ExpenseJSON {
    token: string;
    travel: string;
    name: string;
    amount: number;
    category: string;
    date: string;
    place: string;
    
}

export class Expense {
    public token: string;
    public travel: string;
    public name: string;
    public amount: number;
    public category: string;
    public date: string;
    public place: string;

    public static toJSON(model: Expense): ExpenseJSON {
        return model as ExpenseJSON;
    }
}