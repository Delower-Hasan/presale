import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import * as contractfile from "../helper/contractData";
import { toast } from "react-toastify";
import Button from "react-bootstrap-button-loader";
import * as constdata from "../hooks/constant";
import { parseUnits } from "@ethersproject/units";

import {
  getUsdtoBnb,
  getContract,
  getPerDollarPrice,
} from "../helper/contractData";
import Web3 from "web3";
import { presale_address, presale_abi } from "../hooks/constant";
// let address_zero = "0x0000000000000000000000000000000000000000";
export default function Buy() {
  const context = useWeb3React();
  const { account, library } = context;
  const [loading, setLoading] = useState(false);
  const [isApprove, setIsApprove] = useState(true);
  const [paymenttype, setPaymenttype] = useState(false);
  const [busdapprove, setBusdapprove] = useState(false);
  const [usdtapprove, setUsdtapprove] = useState(false);
  const [userbal, setUserBal] = useState(0);
  const [refresh, setRefresh] = useState(new Date());
  const [UsdtoBnb, setUsdtoBnb] = useState(0);
  const [perDollarPrice, setPerDollarPrice] = useState(0);
  const [buttonText, setButtonText] = useState("Approve");
  

  const [amount, setAmount] = useState("0.0");
  const [token, setToken] = useState("0.0");
  const [error_msg, setError_msg] = useState("");
  // const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const web3 = new Web3(Web3.givenProvider);
  const AddressZero = "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    // setWeb3(new Web3(Web3.givenProvider));
    const _contract = new web3.eth.Contract(presale_abi, presale_address);
    setContract(_contract);

    async function checkApprove() {
      try {
        if (account) {
          let busdconatrct = await contractfile.getBusdContract();
          let usdtconatrct = await contractfile.getUsdtContract();

          let busdcheck = await contractfile.checkApprove(
            busdconatrct,
            account
          );
          let usdtcheck = await contractfile.checkApprove(
            usdtconatrct,
            account
          );

          if (parseFloat(busdcheck) > 10000) {
            setBusdapprove(true);
          }

          if (parseFloat(usdtcheck) > 10000) {
            setUsdtapprove(true);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }

    checkApprove();
  }, [account]);

  checkApprove(;

  useEffect(() => {
    async function getUserBal() {
      if (account) {
        let usdtoBnb = await getUsdtoBnb(await getContract());
        let pdp = await getPerDollarPrice(await getContract());
        console.log("response", usdtoBnb);
        setUsdtoBnb(usdtoBnb);
        setPerDollarPrice(pdp);
        let contract = await contractfile.getContract();
        let userB = await contract.ikeBalance(account);
        userB = web3.utils.fromWei(userB.toString(), "ether");
        console.log("userB", userB);
        setUserBal(userB);
      }
    }

    getUserBal();
  }, [refresh, account]);

  const handlePaymentChange = async (e) => {
    setPaymenttype(e.target.value);
    console.log(e.target.value);
    if (e.target.value === "1") {
      //&& e.target.value !== "3"
      if (usdtapprove === true) {
        setIsApprove(true);
      } else {
        setIsApprove(false);
      }
    } else if (e.target.value === "2") {
      if (busdapprove === true) {
        setIsApprove(true);
      } else {
        setIsApprove(false);
      }
    } else {
      setIsApprove(true);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    if (paymenttype !== "3") {
      if (isNaN(e.target.value)) {
        setToken(0);
        setError_msg("(please enter valid amount.)");
        return;
      } else if (parseFloat(e.target.value) === 0) {
        setToken(0);
        setError_msg("(please enter valid amount.)");
        return;
      } else if (parseFloat(e.target.value) < constdata.minInvest) {
        setError_msg(`amount must be greater ${constdata.minInvest} USD`);
        setToken(0);
        return;
      } else {
        setError_msg("");
        setToken(
          parseFloat((e.target.value * constdata.tokenPerUSD).toFixed(3))
        );
      }
    } else {
      if (isNaN(e.target.value)) {
        setToken(0);
        setError_msg("(please enter valid amount.)");
        return;
      } else if (parseFloat(e.target.value) === 0) {
        setToken(0);
        setError_msg("(please enter valid amount.)");
        return;
      } else {
        setError_msg("");
        setToken(
          parseFloat(
            e.target.value * constdata.usdtToBnb * constdata.tokenPerUSD
          ).toFixed(3)
        );
      }
    }
  };

  const handleBuynow = async () => {
    try {
      setLoading(true);
      console.log("IN");
      if (account) {
        let addr = AddressZero;
        console.log("IN");
        if (window.location.href.includes("?ref=")) {
          addr = window.location.href.substring(
            window.location.href.indexOf("=") + 1
          );
        }
        if (
          (paymenttype === "1" || paymenttype === "2") &&
          !isNaN(amount) &&
          amount > 0
        ) {
          console.log("IN");
          let decimals = 18;
          if (paymenttype === "1") {
            decimals = 18;
            console.log("IN");
          }
          console.log("IN");
          // let check_balance = await contractfile.checkBalance(library,
          //   account,
          //   paymenttype
          // );
          console.log("IN");
          if (true) {
            // parseFloat(check_balance) >= parseFloat(amount)
            console.log("IN", addr);
            // let contract = await contractfile.getContract(library);
            let _value = parseUnits(amount, decimals);
            console.log(_value.toString());
            console.log("paymenttype", paymenttype);

            let tx = await contract.methods
              .buyfromToken(paymenttype, addr, _value)
              .send({
                from: account,
              });

            console.log("tx", tx);
            let response = await tx.wait();
            if (response) {
              if (response.status === 1) {
                toast.success(
                  "success ! Your Last Transaction is Successfull."
                );
                setLoading(false);
                setIsApprove(true);
                setRefresh(new Date());
                window.location.reload();
              } else if (response.status === 0) {
                toast.error("error ! Your Last Transaction is Failed.");
                setLoading(false);
                window.location.reload();
                setRefresh(new Date());
              } else {
                toast.error("error ! something went wrong.");
                setLoading(false);
                window.location.reload();
                setRefresh(new Date());
              }
            } else {
              toast.error("Opps ! something went wrong!");
              setLoading(false);
              window.location.reload();
            }
          } else {
            toast.error("you don't have sufficient funds in your account ");
            setLoading(false);
          }
        } else {
          let response = await contract.methods.buyFromNative(addr).send({
            value: web3.utils.toWei(amount.toString(), "ether"),
            from: account,
          });
          if (response) {
            toast.success("success ! Your Last Transaction is Successfull.");
          } else {
            toast.error("User denied Signature!!.");
          }

          setLoading(false);
          window.location.reload();
        }
      } else {
        toast.error("Please Connect Wallet !");
        setLoading(false);
      }
    } catch (err) {
      // typeof err.data !== "undefined"
      //   ? toast.error(err.data.message)
      //   : toast.error(err.message);
      setLoading(false);
      console.log(err);
      window.location.reload();
    }
  };

  const handleApproveToken = async () => {
    try {
      setLoading(true);
      if (account) {
        if (paymenttype) {
          let contract;
          let decimals = 18;
          if (paymenttype === "1") {
            contract = await contractfile.getUsdtContract(library);
            decimals = 18;
          } else if (paymenttype === "2") {
            contract = await contractfile.getBusdContract(library);
          } else {
            toast.error("something went wrong ! please try again later");
            setLoading(false);
            setIsApprove(true);
            return false;
          }
          let _amount = parseUnits(amount, decimals);
          let tx = await contract.approve(constdata.presale_address, _amount);
          let response = await tx.wait();
          if (response) {
            if (response.status === 1) {
              toast.success("success ! Your Last Transaction is Successfull.");
              setLoading(false);
              setIsApprove(true);
              if (paymenttype === "1") {
                setUsdtapprove(true);
              } else if (paymenttype === "2") {
                setBusdapprove(true);
              }
            } else if (response.status === 0) {
              toast.error("error ! Your Last Transaction is Failed.");
              setLoading(false);
            } else {
              toast.error("error ! something went wrong.");
              setLoading(false);
            }
          } else {
            toast.error("Opps ! something went wrong!");
            setLoading(false);
          }
        } else {
          toast.error("Please select payment type !");
          setLoading(false);
        }
      } else {
        toast.error("Please Connect Wallet !");
        setLoading(false);
      }
    } catch (err) {
      // typeof err.data !== "undefined"
      //   ? toast.error(err.data.message)
      //   : toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-trade">
        <div className="app-trade__items grid">
          <div className="app-trade__item flex">
            <div className="app-trade__item-input">
              <div className="app-trade__token">
                <div className="form-check form-check-inline flex flex-row space-between">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    onChange={(e) => handlePaymentChange(e)}
                    id="inlineRadio1"
                    value="1"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    <img src="../images/tether.png" alt="bnb-logo" />
                    USDT
                  </label>
                </div>
                <div className="form-check form-check-inline flex flex-row space-between">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    onChange={(e) => handlePaymentChange(e)}
                    id="inlineRadio2"
                    value="2"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    <img src="../images/usdc.png" alt="bnb-logo" />
                    USDC
                  </label>
                </div>
                <div className="form-check form-check-inline flex flex-row space-between">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    onChange={(e) => handlePaymentChange(e)}
                    id="inlineRadio2"
                    value="3"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    <img src="../images/bnb-logo.png" alt="matic-logo" />
                    BNB
                  </label>
                </div>
              </div>
              <input
                type="text"
                style={{ border: "none", width: "100%" }}
                onChange={handleAmountChange}
                value={amount}
                className="app-trade__item-value"
                placeholder="0.0"
              />
              {/* <p>0.0</p> */}
              {/* <div className="click-box">
                <div className="lbl">Click here</div>
                <div className="tag">(Live BNB TO USD)</div>
              </div> */}
            </div>
          </div>
          <div className="app-trade__item flex">
            <div className="app-trade__item-info flex flex--column">
              <h3 className="app-trade__token">
                <img src="../images/logo.png" alt="min-logo" />
                HRK Token
              </h3>
              <p className="app-trade__balance">
                Balance <span id="myTokens">{userbal}</span> <br />
                HRK{" "}
              </p>
            </div>
            <div className="app-trade__item-input">
              <div className="app-trade__item-value">
                <span id="get">~{token}</span>
              </div>
            </div>
          </div>
          <small className="text-danger">{error_msg}</small>
        </div>
        {isApprove ? (
          <Button
            loading={loading}
            className="btn"
            style={{ textAlign: "center" }}
            onClick={handleBuynow}
          >
            Buy Now
          </Button>
        ) : (
          <Button
            loading={loading}
            className="btn"
            style={{ textAlign: "center" }}
            onClick={handleApproveToken}
          >
            Approve
          </Button>
        )}
      </div>
    </>
  );
}
