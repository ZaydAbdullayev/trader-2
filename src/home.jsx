// src/pages/TokenArena.jsx
import { useEffect, useState } from "react";
import { RiTwitterXFill } from "react-icons/ri";
import "./home.css";
import { MiniChart } from "./components/mini-chart";

export const TokenArena = () => {
  const [tokens, setTokens] = useState([]);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=50&page=1"
    )
      .then((res) => res.json())
      .then((data) => {
        const withAnimation = data.map((item) => ({
          ...item,
          animation: getRandomAnimation(),
        }));
        setTokens(withAnimation);
      });

    setTimeout(() => {
      setIsShaking(true);
    }, 1300);
  }, []);

  const getRandomAnimation = () => {
    const animations = [
      "bounce-in",
      "spin-in",
      "fall-in",
      "wiggle-in",
      "zoom-pop",
      "float-up",
      "slide-crazy",
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  };


  return (
    <div className="arena-wrapper">
      {/* Navbar */}
      <nav className="w100 navbar df jcsb aic">
        <h1 className="logo-text">Degen Deck</h1>
        <div className="navbar-buttons df aic gap-10">
          <a
            href="https://x.com/degendeck_sol"
            target="_blank"
            rel="noopener noreferrer"
            className="df aic gap-10 btn post"
          >
            <RiTwitterXFill /> Follow us
          </a>
          <button className="btn confirm">Login</button>
        </div>
      </nav>

      <section className="w100 df gap-20 contents">
        <aside className="df fdc aic">
          <ul className="w100 chain-list">
            {[
              "Solana",
              "Ethereum",
              "Base",
              "Arbitrum",
              "Polygon",
              "Sui",
              "BNB Chain",
              "Optimism",
              "Avalanche",
              "Tron",
              "Sei",
              "Mantle",
            ].map((chain) => (
              <li key={chain}>{chain}</li>
            ))}
          </ul>

          <div className="w100 df fdc gap-10 sidebar-highlight">
            <p>
              <strong>24h Volume:</strong> $4.82B
            </p>
            <p>
              <strong>Active Traders:</strong> 142,389
            </p>
            <p>
              <strong>AI Insights Enabled</strong> ✔
            </p>
          </div>
          <div className="w100 df fdc links">
            <button className="btn watermark">Connect Wallet</button>
          </div>
        </aside>
        <main className="w100 df fdc gap-20">
          <h1 className="w100 df dashboard-title">Dashboard</h1>

          <div className="stats-grid">
            <div className="stats-box cap">
              <p className="title">Market Cap</p>
              <h3>$3,395,113,224,095</h3>
              <span className="green">▼ 3.8%</span>
              <div className="mini-graph">
                <MiniChart data={[5, 10, 8, 12, 7, 14, 20, 15]} type="gain" />
              </div>
            </div>

            <div className="stats-box volume">
              <p className="title">24h Trading Volume</p>
              <h3>$115,139,658,255</h3>
              <span className="red">▼ 4.01%</span>
              <div className="mini-graph">
                <MiniChart data={[20, 18, 15, 14, 10, 8, 5]} type="loss" />
              </div>
            </div>

            <div className="stats-box trending">
              <p className="title">🔥 Trending</p>
              <ul>
                <li>
                  <strong>AI Companions</strong> <span>$0.1343</span>{" "}
                  <span className="red">-6.2%</span>
                </li>
                <li>
                  <strong>Launch Coin on Believe</strong> <span>$0.2527</span>{" "}
                  <span className="green">+25.1%</span>
                </li>
                <li>
                  <strong>Sui</strong> <span>$3.71</span>{" "}
                  <span className="red">-4.5%</span>
                </li>
              </ul>
            </div>

            <div className="stats-box gainers">
              <p className="title">🚀 Top Gainers</p>
              <ul>
                <li>
                  <strong>Litentry</strong> <span>$1.48</span>{" "}
                  <span className="green">+317.5%</span>
                </li>
                <li>
                  <strong>Maple</strong> <span>$17.16</span>{" "}
                  <span className="green">+150.8%</span>
                </li>
                <li>
                  <strong>BabyBoomToken</strong> <span>$0.335</span>{" "}
                  <span className="green">+38.3%</span>
                </li>
              </ul>
            </div>
          </div>
          <h1 className="arena-title">Meme Token Arena</h1>
          {/* Filter Bar */}
          <div className="filter-container">
            <div className="filter-box">
              <input
                type="text"
                placeholder="Search..."
                className="filter-input"
              />
              <i></i>
              <div className="options">
                <button className="active">Top</button>
                <button>Trending</button>
                <button>New</button>
                <button>Gainers</button>
                <button>Losers</button>
                <button>Volume</button>
              </div>
              <div className="switch">
                <input type="checkbox" id="switch" className="switch-input" />
                <label htmlFor="switch" className="switch-label">
                  <span className="switch-label-text">Live</span>
                </label>
              </div>

              <div className="options">
                <button>24H</button>
                <button>1W</button>
                <button>1M</button>
                <button>3M</button>
                <button>1Y</button>
              </div>
            </div>
          </div>

          <div className="w100 token-grid">
            {tokens.map((token, index) => (
              <div
                key={token.id}
                className={`token-card ${token.animation} ${
                  isShaking ? "shake" : ""
                }`}
                style={{ "--i": index }}
              >
                <img src={token.image} alt={token.symbol} />
                <div className="token-name">{token.symbol}</div>
                <div className="token-price">
                  ${token.current_price.toFixed(5)}
                </div>
                <div
                  className={`token-change ${
                    token.price_change_percentage_24h >= 0 ? "green" : "red"
                  }`}
                >
                  {token.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </main>
      </section>

      <div className="df fdc aic gap-5 footer">
        <h3>License</h3>
        <p>
          This project is licensed under the MIT License. See the <u>LICENSE</u>{" "}
          file for details.
        </p>
        <h3>Disclaimer</h3>
        <p>
          This project is for educational purposes only. The information
          provided is not financial advice. Always do your own research before
          investing.
        </p>
        <p>© 2025 Degen Deck. All rights reserved.</p>
      </div>
    </div>
  );
};
