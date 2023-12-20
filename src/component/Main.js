import React, { useState, useEffect } from "react";
import ConnectButton from "../helper/ConnectButton";
import {
  getUsdtoBnb,
  getContract,
  getPerDollarPrice,
} from "../helper/contractData";
import Buy from "./Buy";
import { useWeb3React } from "@web3-react/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Countdown from "react-countdown";
import { countdowntime } from "../hooks/constant";

export default function Main() {
  const context = useWeb3React();
  const { account } = context;
  const [referrallink, setReferrallink] = useState(
    "Please connect your wallet first (Metamask/Trustwallet)"
  );

  const [refcopy, setRefcopy] = useState(false);
  const [UsdtoBnb, setUsdtoBnb] = useState(0);
  const [perDollarPrice, setPerDollarPrice] = useState(0);
  // const [addrcopy, setAddrcopy] = useState(false);
  let base_url = `${window.location.href}?ref=`;

  useEffect(() => {
    async function fetchData() {
      if (account) {
        let response = await getUsdtoBnb(await getContract());
        console.log("response", response);
        setUsdtoBnb(response);
        setReferrallink(`${base_url}${account}`);
      } else {
        setReferrallink("Please connect your wallet first");
      }
    }
    fetchData();
  }, [account, base_url]);

  const whitelistcountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <ul className="app-timer js-app-timer grid">
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-days">0</span>
            <h3 className="app-timer__title">Days</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-hours">0</span>
            <h3 className="app-timer__title">Hours</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-minutes">0</span>
            <h3 className="app-timer__title">Minutes</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-seconds">0</span>
            <h3 className="app-timer__title">Seconds</h3>
          </li>
        </ul>
      );
    } else {
      // Render a countdown
      return (
        <ul className="app-timer js-app-timer grid">
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-days">{days}</span>
            <h3 className="app-timer__title">Days</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-hours">{hours}</span>
            <h3 className="app-timer__title">Hours</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-minutes">{minutes}</span>
            <h3 className="app-timer__title">Minutes</h3>
          </li>
          <li className="app-timer__item">
            <span className="app-timer__value js-timer-seconds">{seconds}</span>
            <h3 className="app-timer__title">Seconds</h3>
          </li>
        </ul>
      );
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a href="http://www.hrvatskakuna.com/" className="navbar-brand">
            <img
              src="../images/logo.png"
              alt="coin-67"
              style={{ width: "auto", height: "100px" }}
            />
          </a>
        </div>
      </nav>

      <main className="main mt-4">
        <section className="app section">
          <div className="app-container container flex flex--column">
            <div className="app__data-container flex flex--column">
              <ConnectButton />
            </div>
            <div className="app__data-wrapper grid">
              <div className="app__data-container flex flex--column">
                <h2 className="app__title">TOTAL HRK</h2>
                <div className="app__data-content">
                  <div className="app__value">
                    <span className="saleqty">5,000,000,000</span>{" "}
                    <span className="tokenSymbol">HRK Token</span>
                  </div>
                </div>
              </div>
              <div className="app__data-container flex flex--column">
                <h2 className="app__title">PRICE PER TOKEN</h2>
                <div className="app__data-content">
                  <div className="app__value">
                    1 USD = <span className="rate">222</span>{" "}
                    <span className="tokenSymbol"> HRK</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="app__data-wrapper grid"></div>
            {/* <div className="app__data-container flex flex--column">
              <h2 className="app__title mb-0">
                Airdrops will be on Pulse-Chain
              </h2>

            </div> */}
            <div className="app__data-container flex flex--column">
              {/* <Countdown
                key={Math.floor(Math.random() * 10 + 1)}
                date={countdowntime}
                renderer={whitelistcountdown}
              /> */}
              {/* <h2 className="app__title mb-0">
                Alternative Coins Eth, Avax, Matic, Fantom Etc, can be sent to
                the wallet address
              </h2>
              <CopyToClipboard text="0x6043c59C77f6bdd6fED7130cA68aBB4Dc1Fe88E2" onCopy={() => {setAddrcopy(true);
                                                                setTimeout(()=>{
                                                                  setAddrcopy(false);
                                                                },2000)}}>
                <div className="token-app btn">
                  0x6043c59C77f6bdd6fED7130cA68aBB4Dc1Fe88E2
                </div>
              </CopyToClipboard>
              {addrcopy && <span className="text-center">copied</span>} */}
            </div>
            <div className="app__data-container flex flex--column">
              <h1 className="text-center mb-5" style={{ color: "#fff" }}>
                Buy Token
              </h1>
              <Buy />
            </div>
          </div>
        </section>
        {/* <section className="app section">
          <div
            className="app-container container flex flex--column"
            style={{ marginTop: "5px!important" }}
          >
            <div
              style={{ textAlign: "center" }}
              className="app__data-container flex flex--column"
            >
              <h1 className="">BIO</h1>
              <br />
              <p>
                Token Name: Pinocchio Token symbol: Pinocchio Token is a
                cryptocurrency with blockchain with smart contract a payment
                system that can be sent from user to user on the peer-to-peer
                bitcoin network without the need for intermediaries.Transactions
                are verified by network nodes through cryptography and recorded
                in a public distributed ledger called a blockchain. The
                cryptocurrency was invented in 2018.
              </p>
              <br />
              <p>Token Price: $25</p>
              <p>Token Supply: 1 trillion </p>
              <p>Decimal:15</p>
            </div>
          </div>
        </section> */}
        <section className="app section">
          <div
            className="app-container container flex flex--column"
            style={{ marginTop: "5px!important" }}
          >
            <div
              style={{ textAlign: "center" }}
              className="app__data-container flex flex--column"
            >
              <h1 className="">
                Share and get paid
                <br /> instantly
              </h1>
              <span>
                Share your referral link and get paid instantly to your wallet
                for every referred HRK purchase.
              </span>
              <br />
              <p>Referral commission 5%</p>
              <br />
              {/* <p>
                Share your referral link or QR code and get commission for
                referred token purchases instantly to your wallet.
              </p> */}
              <br />
              <p>
                <input
                  type="text"
                  id="referLink"
                  value={referrallink}
                  readOnly={true}
                />
              </p>
              <CopyToClipboard
                text={`${base_url}${account}`}
                onCopy={() => {
                  setRefcopy(true);
                  setTimeout(() => {
                    setRefcopy(false);
                  }, 2000);
                }}
              >
                <button className="btn" id="copyreflink">
                  Copy
                </button>
              </CopyToClipboard>
              <span>{refcopy && "copied"}</span>
              <p id="refErr" className="err" style={{ display: "none" }}>
                Please connect your wallet on Binance Smart Chain to generate
                your referral link!
              </p>
            </div>
          </div>
        </section>

        <footer
          className="page-footer font-small cyan darken-3 text-center"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          {/* <!-- Footer Elements --> */}
          <div className="container">
            {/* <!-- Grid row--> */}
            <div class="row">
              {/* <!-- Grid column --> */}
              <div class="col-md-12">
                {/* <div class="mb-2 mt-5 flex-center">
                  <a
                    href="https://instagram.com/frpot_314?r=nametag"
                    class="tw-ic"
                  >
                    <i class="fab fa-instagram fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
                  </a>

                  <a
                    href="https://www.facebook.com/profile.php?id=100078534654052"
                    class="tw-ic"
                  >
                    <i class="fab fa-facebook fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
                  </a>
                  <a
                    href="https://www.frpch.org/donate-frpot-crypto/"
                    class="tw-ic"
                  >
                    <i class="fab fa-firefox fa-lg white-text mr-md-5 mr-3 fa-2x"></i>
                  </a>
                </div> */}
              </div>
              {/* <!-- Grid column --> */}
            </div>
            {/* <!-- Grid row--> */}
          </div>
          {/* <!-- Footer Elements --> */}

          {/* <!-- Copyright --> */}
          <div class="footer-copyright text-center py-3">
            © All Rights Reserved HRK
          </div>
          {/* <!-- Copyright --> */}
        </footer>
      </main>
    </div>
  );
}
