import abi from "./utils/BuyMeACoffee.json";
import { ethers } from "ethers";
import React, {useEffect, useState} from "react";

function App() {
  //Contract Address & ABI
  const contractAddress = "0x726e80f418b497455Fa0f63820D6AB81A4DCBCF5";
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  //Wallet Connection
  const isWalletConnected = async () => {
    try {
      const {ethereum} = window;

      const accounts = await ethereum.request({method: 'eth_accounts'});
      console.log("Accounts", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        alert("Wallet is connected");
        console.log("Wallet is connected" + account);
      } else {
        alert("Make sure Metamask wallet is connected");
        console.log("Make sure Metamask wallet is connected");
      }
    } catch (error) {
        console.log("Error", error);
    }
  };

  const connectWallet = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        console.log("Get Metamask");
      }
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      
      setCurrentAccount(accounts[0]);

    } catch (error) {
        console.log(error);
    }
  };

  //Function to fecth all memos stored on-chain
  const getMemos = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);
        const memos = await buyMeACoffee.getMemos();
        console.log(memos);
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    //Create an event handler for when someone send us a new memo
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("New memo:", from, timestamp, name, message);
      setMemos(memos => 
        [...memos,
         {
          address: from,
          timestamp: new Date(timestamp * 1000),
          name: name,
          message: message,
          from
        }
        ]);
    };

    const {ethereum} = window;

    //Listen for new memo events
    if(ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if(buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, [])

  const buyCoffee = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("Buying Coffee...");
        const coffeeTxn = await buyMeACoffee.buyCoffee(name ? name : "anon", message ? message : "no message", {value: ethers.utils.parseEther("0.001")});

        alert("Buying coffee please wait");
        await coffeeTxn.wait();

        console.log("miend", coffeeTxn.hash);

        console.log("Coffee purchased!");
        alert("Thanks for the coffee!");

        //Clear form files
        setName("");
        setMessage("");
      }

    } catch (error) {
      console.log(error);
    }
    
  }


  return (
    <div className="App">
      <title className="title">Buy Juan a Coffee!</title>

      <main className="main">
      {currentAccount ? (
              <div>
              <form>
                <div className="principal">
                <label className="name">Name</label>
                <br/>
      
                <input className="name-input" type="text" id="name" placeholder="anon" onChange={onNameChange} />
                </div>
                <br/>
                <div>
                  <label className="message">Send to Juan a message</label>
                  <br/>
      
                  <textarea className="text-area" id="message" placeholder="Enjoy your Coffee!" onChange={onMessageChange} required></textarea>
                </div>
                <div>
                  <button className="button" type="button" onClick={buyCoffee}>
                    Send 1 Coffee for 0.001 ETH
                  </button>
                </div>
              </form>
            </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      </main>

      {currentAccount && <h1>Coffees received</h1>}
      {currentAccount && memos.map((memo, idx) => {
        return (
          <div key={idx} style={{border: "2px solid", borderRadius: "5px", padding: "5px", margin: "5px"}}>
              <p styles={{fontWeight: "bold"}}>{memo.message}</p>
              <p>From: {memo.name} at {memo.timestamp.toString()}
              <br/>
              Wallet Address: {memo.from}
              </p>
          </div>
        )
      })}

      <footer className="footer">Juan Ignacio Lazarte Web 3 Dev.</footer>
    </div>
  );
}

export default App;
