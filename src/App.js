import React from 'react';
import Main from './component/Main';
import { Web3ReactProvider } from "@web3-react/core";
import { POLLING_INTERVAL } from "./hooks/connectors";
import { Web3Provider } from "@ethersproject/providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Web3ReactProvider getLibrary={getLibrary}>
        <Main />
      </Web3ReactProvider>
    </div>
  );
}

export default App;
