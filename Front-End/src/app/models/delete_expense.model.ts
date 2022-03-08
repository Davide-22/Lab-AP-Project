export interface DeleteExpenseJSON {
    name: string;
    travel: string;
}

export class DeleteExpense {
    public name: string;
    public travel: string;

    public static toJSON(model: DeleteExpense): DeleteExpenseJSON {
        return model as DeleteExpenseJSON;
    }
}