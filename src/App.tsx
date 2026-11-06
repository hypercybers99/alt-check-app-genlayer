import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WalletModal } from "./components/WalletModal";
import { Home } from "./pages/Home";
import { Board } from "./pages/Board";
import { Register } from "./pages/Register";
import { PageDetail } from "./pages/PageDetail";
import { Method } from "./pages/Method";
import { Evidence } from "./pages/Evidence";
import { WalletPage } from "./pages/WalletPage";

export const App: React.FC = () => {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  return (
    <ErrorBoundary>
      <WalletProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
            <Header onOpenWallet={() => setWalletModalOpen(true)} />
            <main id="main-content" className="flex-1 focus:outline-none">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/board" element={<Board />} />
                <Route path="/register" element={<Register />} />
                <Route path="/p/:id" element={<PageDetail />} />
                <Route path="/method" element={<Method />} />
                <Route path="/evidence" element={<Evidence />} />
                <Route path="/wallet" element={<WalletPage />} />
              </Routes>
            </main>
            <Footer />
            <WalletModal
              isOpen={walletModalOpen}
              onClose={() => setWalletModalOpen(false)}
            />
          </div>
        </BrowserRouter>
      </WalletProvider>
    </ErrorBoundary>
  );
};
