export interface ExpenseJSON {
    name: string;
}

export class Expense {
    public name: string;

    public static toJSON(model: Expense): ExpenseJSON {
        return model as ExpenseJSON;
    }
}