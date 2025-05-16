import { useEffect, useRef, useState, useCallback } from "react";
import { createChart } from "lightweight-charts";
import { FiExternalLink, FiCopy } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { tardesHistory } from "../context/data";

const randomWallet = () =>
  `0x${Math.random().toString(16).slice(2, 8)}...${Math.random()
    .toString(16)
    .slice(2, 6)}`;

const generateInitialCandles = () => {
  let time = Math.floor(Date.now() / 1000) - 3600 * 24;
  let price = 0.55;
  return Array.from({ length: 500 }, () => {
    const open = price;
    const close = +(price + (Math.random() - 0.5) * 0.02).toFixed(4);
    const high = Math.max(open, close) + Math.random() * 0.03;
    const low = Math.min(open, close) - Math.random() * 0.03;
    price = close;
    const candle = { time, open, high, low, close };
    time += 3000;
    return candle;
  });
};

const getNextCandle = (last) => {
  const open = last.close;
  const close = +(open + (Math.random() - 0.5) * 0.02).toFixed(4);
  const high = Math.max(open, close) + Math.random() * 0.01;
  const low = Math.min(open, close) - Math.random() * 0.01;
  return { time: last.time + 3000, open, high, low, close };
};

const generateFakeVolume = (candle) => ({
  time: candle.time,
  value: Math.floor(Math.random() * 1000 + 100),
  color: candle.open > candle.close ? "#ff4d6d" : "#00ff95",
});

const generateFakeTrades = (existing = []) => {
  const sides = ["Buy", "Sell"];
  const newTrade = () => ({
    side: sides[Math.floor(Math.random() * 2)],
    price: (0.2 + Math.random() * 0.9).toFixed(4),
    amount: (Math.random() * 1000).toFixed(2),
    time: new Date().toLocaleTimeString(),
  });
  return [...existing.slice(-17), newTrade()];
};

export const TokenDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token;

  const chartRef = useRef(null);
  const candleSeriesRef = useRef();
  const volumeSeriesRef = useRef();

  const [candles, setCandles] = useState(generateInitialCandles());
  const [devEarnings, setDevEarnings] = useState(() => token.volume * 0.0005);
  const [wallet] = useState(randomWallet);
  const [trades, setTrades] = useState(() => generateFakeTrades(tardesHistory));
  const [boostScore, setBoostScore] = useState(83);

  const [pairInfo] = useState(() => ({
    created: "3mo 2d ago",
    pooledLaunchCoin: token.volume,
    pooledSol: token.holders,
    pair: `LAUNCHCOIN / ${token.symbol}`,
  }));

  const mutationValue = useCallback((val) => {
    const v = parseFloat(val);
    const mutated = v + (Math.random() > 0.5 ? 1 : -1);
    return mutated.toFixed(0);
  }, []);

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 700,
      layout: {
        background: { color: "#15171c" },
        textColor: "#00ff95",
      },
      grid: {
        vertLines: { color: "#333" },
        horzLines: { color: "#333" },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      priceScale: { borderColor: "#333" },
      localization: {
        dateTimeLocale: "en-US",
        timeFormatter: (time) => new Date(time * 1000).toLocaleTimeString(),
      },
    });

    const cs = chart.addCandlestickSeries({
      upColor: "#00ff95",
      downColor: "#ff4d6d",
      wickUpColor: "#00ff95",
      wickDownColor: "#ff4d6d",
    });

    const vs = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceLineVisible: false,
      overlay: false,
      priceScaleId: "volume",
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    candleSeriesRef.current = cs;
    volumeSeriesRef.current = vs;
    cs.setData(candles);
    vs.setData(candles.map(generateFakeVolume));
  }, [candles]);

  useEffect(() => {
    const intervals = [
      setInterval(() => {
        setDevEarnings((prev) => prev + Math.random() * 5);
      }, 3000),

      setInterval(() => {
        setTrades((prev) => generateFakeTrades(prev));
      }, 3000),

      setInterval(() => {
        setBoostScore((prev) => {
          const next = prev + (Math.random() > 0.5 ? 1 : -1);
          return Math.max(0, Math.min(next, 100));
        });
      }, 5000),

      setInterval(() => {
        setCandles((prev) => {
          const next = getNextCandle(prev[prev.length - 1]);
          const updated = [...prev, next];
          candleSeriesRef.current?.setData(updated);
          volumeSeriesRef.current?.setData(updated.map(generateFakeVolume));
          return updated;
        });
      }, 3000),
    ];

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="token-details">
      <div className="header">
        <div className="df aic gap-15">
          <button className="btn" onClick={() => navigate("/")}>
            Go Back
          </button>
          <img src={token.logo} alt={token.name} className="detail-logo" />
        </div>
        <h1>
          {token.name} <span className="symbol">({token.symbol})</span>
        </h1>
        <div className="df aic gap-5 wallet-actions">
          <button title="Copy" className="df aic jcc">
            <FiCopy />
          </button>
          <a
            href="#"
            title="Explorer"
            target="_blank"
            rel="noreferrer"
            className="df aic jcc"
          >
            <FiExternalLink />
          </a>
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-box">
          <input type="text" placeholder="Search..." className="filter-input" />
          <div className="switch">
            <input type="checkbox" id="switch" className="switch-input" />
            <label htmlFor="switch" className="switch-label">
              <span className="switch-label-text">Live</span>
            </label>
          </div>
          <div className="options">
            <button>Price</button>
            <button>Market Cap</button>
            <button>TradingView</button>
          </div>
          <div className="options">
            <button>24H</button>
            <button>1W</button>
            <button>1M</button>
            <button>3M</button>
            <button>1Y</button>
          </div>
          <select className="filter-select">
            <option value="all">All</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
      </div>

      <div className="content-layout">
        <div className="left-panel">
          <div className="chart-box">
            <div ref={chartRef} className="chart-container"></div>
          </div>
          <div className="trade-history">
            <h3>Latest Trades</h3>
            <table>
              <thead>
                <tr>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t, i) => (
                  <tr key={i} className={t?.side.toLowerCase()}>
                    <td>{t?.side}</td>
                    <td>${t?.price}</td>
                    <td>{t?.amount}</td>
                    <td>{t?.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-panel">
          <div className="info-box">
            <p>
              <strong>Total Volume:</strong> ${token.volume.toLocaleString()}
            </p>
            <p>
              <strong>Developer Wallet:</strong>{" "}
              <span className="wallet">{wallet}</span>
            </p>
            <p>
              <strong>Dev Fee (0.05%):</strong>{" "}
              <span className="earnings">${devEarnings.toFixed(2)}</span>
            </p>
          </div>

          <div className="audit-box">
            <h3>Audit & Info</h3>
            <ul>
              <li>
                Audit Status:{" "}
                <span className={token.audited ? "green" : "red"}>
                  {token.audited ? "✔ Verified" : "✘ Not Audited"}
                </span>
              </li>
              <li>
                Launch Date: <span>{token.launched || "~"}</span>
              </li>
              <li>MCAP: ${token.mcap.toLocaleString()}</li>
              <li>FDV: ${token.fdv.toLocaleString()}</li>
              <li>
                Boost Score: <span className="yellow">{boostScore}%</span>
              </li>
            </ul>
            <div className="boost-meter">
              <div
                className="progress"
                style={{ "--percent": boostScore }}
              ></div>
              <span>Boost Score: {boostScore}%</span>
            </div>
          </div>

          <div className="pair-details">
            <h3>Pair Info</h3>
            <ul>
              <li>
                Pair created: <strong>{pairInfo.created}</strong>
              </li>
              <li>
                Pooled LAUNCHCOIN:{" "}
                <strong>{mutationValue(pairInfo.pooledLaunchCoin)}</strong>{" "}
                ($1.2M)
              </li>
              <li>
                Pooled SOL: <strong>{mutationValue(pairInfo.pooledSol)}</strong>{" "}
                ($923K)
              </li>
              <li>
                Pair: <strong>{pairInfo.pair}</strong>
              </li>
            </ul>
          </div>

          <div className="about-token">
            <h3>About Token</h3>
            <p>
              <strong>{token.name}</strong> is a revolutionary token that aims
              to transform the crypto landscape. With a focus on security,
              transparency, and community engagement, it offers a unique
              opportunity for investors to participate in the future of
              decentralized finance. The token is designed to provide users with
              a seamless experience, enabling them to trade, stake, and earn
              rewards effortlessly. Backed by a dedicated team of developers and
              a vibrant community.
              <br />
              <br />
              <strong>
                <u>Disclaimer:</u> <u>{token.name}</u>
              </strong>{" "}
              This token is not a financial instrument and should not be
              considered as investment advice. Always do your own research and
              consult with a financial advisor before making any investment
              decisions. The crypto market is highly volatile and investments
              can result in significant losses.
            </p>
          </div>
          <div className="df fw links gap-10">
            <h3 className="w100">Socials</h3>
            <a href="" className="btn">
              Twitter X
            </a>
            <a href="" className="btn">
              Telegram
            </a>
            <a href="" className="btn">
              Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
