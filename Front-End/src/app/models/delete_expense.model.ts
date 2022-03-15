export interface DeleteExpenseJSON {
    token: string;
    travel: string;
    name: string;
    _id: number;
}

export class DeleteExpense {
    public token: string;
    public travel: string;
    public name: string;
    public _id: number;

    public static toJSON(model: DeleteExpense): DeleteExpenseJSON {
        return model as DeleteExpenseJSON;
    }
}