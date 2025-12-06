import { useQuery } from "@tanstack/react-query";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { apiClient } from "../../lib/api-client";
import { useUser } from "../../hooks/useUser";
import type { Transaction } from "../../types";
import { format } from "date-fns";
import { Wallet, TrendingUp, TrendingDown, Gift, Recycle } from "lucide-react";

export const WalletPage = () => {
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", "my"],
    queryFn: async () => {
      const response = await apiClient.get<{
        transactions: Transaction[];
        balance: number;
      }>("/transactions/my-transactions");
      return response.data;
    },
  });

  const transactions = data?.transactions || [];
  const balance = data?.balance ?? user?.points ?? 0;

  // Calculate stats
  const totalEarned = transactions
    .filter((t) => t.type === "EARN")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalRedeemed = transactions
    .filter((t) => t.type === "REDEEM")
    .reduce((sum, t) => sum + t.amount, 0);

  const getTransactionIcon = (type: string) => {
    return type === "EARN" ? (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        <Recycle className="w-5 h-5 text-green-600" />
      </div>
    ) : (
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
        <Gift className="w-5 h-5 text-purple-600" />
      </div>
    );
  };

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
        <p className="text-gray-600">
          Track your points and transaction history
        </p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-8">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-green-100 text-sm">Current Balance</p>
              <p className="text-4xl font-bold">
                {balance.toLocaleString()} pts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-200" />
              <div>
                <p className="text-green-100 text-xs">Total Earned</p>
                <p className="text-lg font-semibold">
                  +{totalEarned.toLocaleString()} pts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-200" />
              <div>
                <p className="text-green-100 text-xs">Total Redeemed</p>
                <p className="text-lg font-semibold">
                  -{totalRedeemed.toLocaleString()} pts
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Transaction History
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Start donating recyclables to earn points!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(
                        new Date(transaction.createdAt),
                        "dd MMM yyyy, HH:mm"
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      transaction.type === "EARN"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-purple-100 text-purple-800 border-purple-200"
                    }
                  >
                    {transaction.type === "EARN" ? "+" : "-"}
                    {transaction.amount.toLocaleString()} pts
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
};
