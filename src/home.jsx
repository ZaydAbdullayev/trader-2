// src/pages/TokenArena.jsx
import { useEffect, useState } from "react";
import { RiTwitterXFill } from "react-icons/ri";
import "./home.css";

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
        <h1 className="logo-text">Degen Token Wall</h1>
        <div className="navbar-buttons df aic gap-10">
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="df aic gap-10 btn post"
          >
            <RiTwitterXFill /> Follow us
          </a>
          <button className="btn confirm">Login</button>
        </div>
      </nav>

      <h1 className="arena-title">🔥 Meme Token Arena</h1>
      {/* Filter Bar */}
      <div className="filter-container">
        <div className="filter-box">
          <input type="text" placeholder="Search..." className="filter-input" />
          <i></i>
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

      <div className="token-grid">
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
            <div className="token-price">${token.current_price.toFixed(5)}</div>
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
        <p>© 2025 Degen Token Wall. All rights reserved.</p>
      </div>
    </div>
  );
};
