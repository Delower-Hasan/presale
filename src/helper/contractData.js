import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import * as constdata from "../hooks/constant";
import { RPC_URLS } from "../hooks/connectors";
import { RPC } from "../hooks/constant";
import { ethers } from "ethers";

// const loadProvider = async () => {
//     try {
//         const web3Modal = new Web3Modal();
//         const connection = await web3Modal.connect();
//         const provider = new ethers.providers.Web3Provider(connection);
//         return provider.getSigner();
//     }
//     catch (e) {
//         console.log("loadProvider: ", e)

//     }
//   }

export let singer = new JsonRpcProvider(RPC_URLS[RPC]);

export async function getContract(library = null) {
  try {
    singer = library ? library.getSigner() : singer;
    let contract = new Contract(
      constdata.presale_address,
      constdata.presale_abi
    );
    return contract.connect(singer);
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

export async function getBusdContract(library = null) {
  try {
    singer = library ? library.getSigner() : singer;
    let contract = new Contract(constdata.busd_address, constdata.token_abi);
    return contract.connect(singer);
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

export async function getUsdtContract(library = null) {
  try {
    singer = library ? library.getSigner() : singer;
    let contract = new Contract(constdata.usdt_address, constdata.token_abi);
    return contract.connect(singer);
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

export async function checkApprove(contract, userAddress = null) {
  try {
    let check = await contract.allowance(
      userAddress,
      constdata.presale_address
    );
    return toFixed(check.toString() / Math.pow(10, 18));
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

export async function Approve(
  contract,
  decimals = 18,
  userAddress = null,
  amount
) {
  try {
    let check = await contract.allowance(
      userAddress,
      constdata.presale_address
    );
    let allowance = ethers.utils.formatUnits(check.toString(), decimals);
    if (allowance !== amount) {
      let approve = await contract.approve(
        userAddress,
        constdata.presale_address,
        ethers.utils.parseUnits(amount, decimals)
      );
      let tx = await approve.wait();
      if (tx.confirmations > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

export async function buyFromToken() {
  try {
  } catch (error) {
    console.log("buyFromToken", error);
  }
}

export async function buyFromNative(contract, address, _value) {
  try {
    console.log(contract);
    console.log(ethers.utils.parseEther(_value.toString()));
    let check = await contract.buyFromNative(address, {
      value: ethers.utils.parseEther(_value.toString()),
      //   gasLimit: 3e7,
    });
    console.log(check);
    let tx = await check.wait();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getUsdtoBnb(contract) {
  try {
    console.log(contract);
    let check = await contract.UsdtoMatic();
    return Number(ethers.utils.formatUnits(check.toString(), 18));
  } catch (error) {
    console.log("getUsdtoBnb", error);
  }
}
export async function getPerDollarPrice(contract) {
  try {
    console.log(contract);
    let check = await contract.perDollarPrice();
    return Number(ethers.utils.formatUnits(check.toString(), 18));
  } catch (error) {
    console.log("getUsdtoBnb", error);
  }
}

export async function checkBalance(library, account, type) {
  let conatrct;
  let decimal = 18;
  if (type === "1") {
    conatrct = await getUsdtContract(library);
    decimal = 6;
  } else {
    conatrct = await getBusdContract(library);
  }
  console.log(conatrct);
  let check = await conatrct.balanceOf(account);
  return ethers.utils.parseUnits(check.toString(), decimal); //.toFixed(5) //toFixed(check.toString() / Math.pow(10,18));
}

function toFixed(x) {
  let e;
  if (Math.abs(x) < 1.0) {
    e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
}
