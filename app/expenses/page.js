// app/expenses/page.js
import Sidebar from "../../components/Sidebar";
import TopProgressCard from "../../components/TopProgressCard";
import ExpensesList from "../../components/ExpensesList";
import RightTopCard from "../../components/RightTopCard";
import RightBottomCard from "../../components/RightBottomCard";

export default function ExpensesPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Middle Section */}
      <div className="flex flex-col h-screen flex-1">
        <div className="h-[35%] ">
          <TopProgressCard />
        </div>
        <div className="h-[65%]">
          <ExpensesList />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col w-[30%]">
        <div className="h-[30%]">
          <RightTopCard />
        </div>
        <div className="h-[70%] ">
         <RightBottomCard />
          
        </div>
      </div>
    </div>
  );
}



