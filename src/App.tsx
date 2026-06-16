import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FloatingHearts } from "./components/FloatingHearts";
import { CursorHearts } from "./components/CursorHearts";
import { PageProposal } from "./pages/PageProposal";
import { PageDateTime } from "./pages/PageDateTime";
import { PageFood } from "./pages/PageFood";
import { PageSummary } from "./pages/PageSummary";
import { ChevronLeft, RotateCcw } from "lucide-react";

function App() {
  const [page, setPage] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  // Navigation handlers
  const handleAcceptProposal = () => {
    setPage(2);
  };

  const handleNextDateTime = () => {
    setPage(3);
  };

  const handleNextFood = () => {
    setPage(4);
  };

  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleReset = () => {
    setPage(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedFoods([]);
  };

  const handleToggleFood = (foodId: string) => {
    setSelectedFoods((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId]
    );
  };

  // Determine progress percentage
  const getProgress = () => {
    switch (page) {
      case 2:
        return 33;
      case 3:
        return 66;
      case 4:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden selection:bg-pink-100 selection:text-pink-600">
      {/* Background floating hearts */}
      <FloatingHearts />
      <CursorHearts />

      {/* Progress & Header Bar (Only visible after Proposal is accepted) */}
      <AnimatePresence>
        {page > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-xl mb-8 flex flex-col items-center gap-4 z-20"
          >
            {/* Top Navigation Row */}
            <div className="w-full flex items-center justify-between px-2">
              {page < 4 ? (
                <button
                  type="button"
                  id="btn-back"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#ff4f8b] transition-colors duration-250 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div className="w-1" /> // Spacer
              )}

              {/* Progress Heart Indicator */}
              <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#ff4f8b]">
                {page === 4 ? "100% Complete" : `Step ${page - 1} of 2`}
              </span>

              {page === 4 ? (
                <button
                  type="button"
                  id="btn-reset"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#ff4f8b] transition-colors duration-250 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restart
                </button>
              ) : (
                <div className="w-1" /> // Spacer
              )}
            </div>

            {/* Progress track */}
            <div className="relative w-full h-1.5 bg-pink-100/50 rounded-full overflow-hidden border border-pink-100/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute left-0 top-0 h-full bg-[#ff4f8b] rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Page Router */}
      <main className="w-full flex justify-center items-center flex-1 z-10">
        <AnimatePresence mode="wait">
          {page === 1 && (
            <PageProposal key="proposal" onAccept={handleAcceptProposal} />
          )}

          {page === 2 && (
            <PageDateTime
              key="datetime"
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              onNext={handleNextDateTime}
            />
          )}

          {page === 3 && (
            <PageFood
              key="food"
              selectedFoods={selectedFoods}
              onToggleFood={handleToggleFood}
              onPlan={handleNextFood}
            />
          )}

          {page === 4 && (
            <PageSummary
              key="summary"
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedFoods={selectedFoods}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Signature */}
      <footer className="mt-8 py-4 w-full flex items-center justify-center gap-1.5 text-xs text-slate-300 font-sans z-10 select-none">
        <span>Made with</span>
        <span className="text-[#ff4f8b] animate-pulse">❤️</span>
        <span>by</span>
        <span className="font-semibold text-white hover:text-[#ff4f8b] transition-colors duration-250">Minhaz</span>
      </footer>
    </div>
  );
}

export default App;
