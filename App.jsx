
import { useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

const App = () => {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi, I’m your NEURO AI agent. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [balance, setBalance] = useState(5);

  const handleSend = () => {
    if (!input.trim() || balance <= 0) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setBalance(balance - 1);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: "Interesting... tell me more." }]);
    }, 1000);
  };

  const endpoint = clusterApiUrl("devnet");
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-950 text-white p-4">
            <div className="max-w-2xl mx-auto">
              <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">NEURO AI</h1>
                <WalletMultiButton className="!bg-blue-600" />
              </header>
              <div className="mb-2 text-sm text-gray-400">
                NEURO Balance: <span className="text-green-400">{balance}</span>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto space-y-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={\`text-sm p-2 rounded-md max-w-xs \${msg.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"}\`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something..."
                  className="flex-1 p-2 rounded bg-gray-800 text-white"
                />
                <button
                  onClick={handleSend}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                >
                  Send
                </button>
              </div>
              {balance <= 0 && (
                <p className="text-red-500 mt-2 text-sm">Out of NEURO. Please top up to continue chatting.</p>
              )}
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
