import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 sm:py-10">
        <div className="flex justify-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight gradient-title">
            Add Transaction
          </h1>
        </div>
        <div className="max-w-3xl mx-auto">
          <AddTransactionForm
            accounts={accounts}
            categories={defaultCategories}
            editMode={!!editId}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}
