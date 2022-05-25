import Head from "next/head";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { Contract, providers } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS } from "../constants";
import { abi } from "../constants";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      // If user is not connected to the Rinkeby network, let them know and throw an error
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 4) {
        window.alert("Change the network to Rinkeby");
        throw new Error("Change the network to Rinkeby");
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (err) {
      console.error(err);
    }
  };
  // checkIfAddressInWhitelist: Checks if the address is in whitelist
  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = getProviderOrSigner(true);
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // call the numAddressesWhitelisted from the contract
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };
  //getNumberOfWhitelisted:  gets the number of whitelisted addresses

  const getNumberOfWhitelisted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract
      const _numOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumOfWhitelisted(_numOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };
  //connectWallet: Connects the MetaMask wallet
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (err) {
      console.log(err);
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disabledInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist daPP</title>
        <meta
          name="description"
          content="A whitelist app for whitelisting the 1st 10 addresses"
        />
      </Head>
      <div className={styles.main}>
        <h1 className={styles.title}>Welcome to the whitelist! </h1>
        <div className={styles.description}>
          {numOfWhitelisted} have already joined the Whitelist
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" alt="" />
        </div>
      </div>
      <footer className={styles.footer}>Made with &#10084; by Alex Muia</footer>
    </div>
  );
}
