export interface DeleteExpenseJSON {
    token: string;
    travel: string;
    name: string;
}

export class DeleteExpense {
    public token: string;
    public travel: string;
    public name: string;

    public static toJSON(model: DeleteExpense): DeleteExpenseJSON {
        return model as DeleteExpenseJSON;
    }
}