import { create } from "ipfs-core";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import ABI from "./ABI.json";
import Navigation from "./components/navigation/navigation";
import FileUpload from "./components/fileUpload/fileUpload";
import defaultImage from "./defaultImage.png";
// import Transfer from "./components/transferNFT/transfer";
import ShowNFT from "./components/showNFT/showNFT";

function App() {
    //for storing image file entered by the user
    const [imageData, setImageData] = useState("");
    //to store the blob of image file
    const [imageUrl, setImageUrl] = useState("");
    //to store the cid created using image file in ipfs
    const [cid, setCid] = useState("");
    //for controlling loading screen
    const [loader, setLoader] = useState(false);
    //for select menu for 'FROM' account
    let [fromOptions, setFromOptions] = useState({
        options: [],
        selected: "",
    });
    //for select menu for 'TO' account
    let [toOptions, setToOptions] = useState({
        options: [],
        selected: "",
    });
    //for image gallery
    let [imageGallery, setImageGallery] = useState([]);
    //for image gallery loading screen
    const [imageLoader, setImageLoader] = useState(false);
    //initialize web3
    let web3 = new Web3("HTTP://127.0.0.1:7545");
    let contract = new web3.eth.Contract(
        ABI,
        "0xaD22A16d6b09b3428760B7De6CBe7a0a836de40B"
    );
    ///////////////////////////////////////////////////////////////////////
    //checking if metamask installed
    let initializeMetamask = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                console.log("MetaMask is installed!");
                let accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                return accounts;
            }
        } catch (err) {
            console.log(err);
        }
    };

    //when the user selects a different account in metamask
    window.ethereum.on("accountsChanged", (account) => {
        console.log("switched to account ", account[0]);
        // setFromOptions({ ...fromOptions, selected: account[0] });
    });

    //get the name
    let getName = async () => {
        try {
            let name = await contract.methods.name().call();
            console.log("token name", name);
        } catch (error) {
            console.log("--error--getName--", error);
        }
    };
    //get symbol
    let getSymbol = async () => {
        try {
            let symbol = await contract.methods.symbol().call();
            console.log("symbol", symbol);
        } catch (error) {
            console.log("--error--getSymbol--", error);
        }
    };
    //mint NFT for the selected address
    let mintNFT = (address, tokenURI) => {
        console.log("address ", address, " token ", tokenURI);
        contract.methods
            .mintNFT(address, tokenURI)
            .send({
                from: address,
                gas: 80000000,
            })
            .on("receipt", (data) => {
                console.log("--nft mint successfull--");
                // balanceOf(address);
                getAllNFT(address);
                // balanceOf(address);
                // setMessage({
                //     data: "transfer successful",
                //     visibility: true,
                // });
            })
            .on("error", (err, receipt) => {
                if (err) {
                    console.error("--error--mintNFT--", err);
                }
            });
    };
    //get all the NFTs of the address
    let getAllNFT = async (address) => {
        try {
            //set screen loader while getting the images
            setImageLoader(true);
            let balance = await balanceOf(address);
            let tokenURIarray = [];
            for (let index = 0; index < balance; index++) {
                let tokenId = await contract.methods
                    .tokenOfOwnerByIndex(address, index)
                    .call();
                let tokenURI = await contract.methods.tokenURI(tokenId).call();
                tokenURIarray.push(tokenURI);
            }
            // console.log("token URI of ", address, " is ", tokenURIarray);
            setImageGallery(tokenURIarray);
            //remove screen loader
            setImageLoader(false);
        } catch (err) {
            console.log("--error--getAllNFT--", err);
        }
    };

    //get the total NFT owned by the address
    let balanceOf = async (address) => {
        try {
            let balance = await contract.methods.balanceOf(address).call();
            // console.log("NFT balance ", balance);
            return parseInt(balance);
        } catch (err) {
            console.error("--error--balanceOf--", err);
        }
    };

    let totalBalance = async (address) => {
        try {
            let balance = await contract.methods.totalSupply().call();
            console.log(balance);
        } catch (error) {
            console.log("--error--totalBalance--", error);
        }
    };
    //get all the accounts in the smart-contract
    let getAccounts = async () => {
        let accountData = [];
        try {
            accountData = await web3.eth.getAccounts();
            // console.log(accountData);
            let accounts = await toObject(accountData);
            setFromOptions({
                ...fromOptions,
                options: accounts,
                selected: accounts[0],
            });
            setToOptions({
                ...toOptions,
                options: accounts,
                selected: accounts[0],
            });
            return accounts[0].value;
        } catch (err) {
            console.log("--error--getAccounts--", err);
            // setMessage({
            //     data: "error while getting accounts, getAccount",
            //     visibility: true,
            // });
        }
    };

    //useEffect/////////////////////////////////////////////////////////////////
    useEffect(() => {
        initializeMetamask().then((acc) => {
            console.log("accounts ", acc);
            // setFromOptions({ ...fromOptions, selected: acc[0] });
        });
        //set default image
        setImageUrl(defaultImage);
        getAccounts();
        // getName();
        // getSymbol();
    }, []);

    useEffect(() => {
        if (fromOptions.selected.value) {
            getAllNFT(fromOptions.selected.value);
        }
    }, [fromOptions]);
    //util functions//////////////////////////////////////////////////////////////
    //to convert array into onbject
    const toObject = async (arr) => {
        let obj = [];
        for (let i = 0; i < arr.length; i++) {
            obj.push({ value: arr[i], label: `Account ${i + 1}` });
        }
        return obj;
    };

    //acual code starts from here
    let handleImageSubmit = async () => {
        try {
            setLoader(true);
            const ipfs = await create({ repo: "ok" + Math.random() });
            //add the image blob to ipfs
            const { cid } = await ipfs.add(imageData);
            const pinData = await ipfs.pin.add(cid);
            //pin the cid
            if (pinData === cid) console.log("pinning successfull");
            else console.error("pinning error");
            //////
            setCid(cid.toString());
            setLoader(false);

            //mint NFT
            console.log("minting......");
            mintNFT(fromOptions.selected.value, `https://ipfs.io/ipfs/${cid}`);
        } catch (err) {
            console.error("error-----", err);
        }
    };
    let handleImageChange = (e) => {
        //get the file uploaded by the user
        setImageData(e.target.files[0]);
        //to display the image as preview by creating blob
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    let handleRedirect = (e) => {
        e.preventDefault();

        //if cid is valid and image is not loading then open
        //the ipfs link in new window to see the NFT in full screen
        if (cid.length > 0 && !loader) {
            const win = window.open(`https://ipfs.io/ipfs/${cid}`, "_blank");
            if (!win) {
                win.focus();
            }
        } else console.log("can't redirect");
    };
    return (
        <div className="App">
            <div className="first__page">
                <div
                    className="dummy"
                    onClick={() => {
                        initializeMetamask();
                    }}
                >
                    click me
                </div>
                <Navigation
                    fromOptions={fromOptions}
                    setFromOptions={setFromOptions}
                />
                <div className="file__nft__holder">
                    <FileUpload
                        handleImageSubmit={handleImageSubmit}
                        handleImageChange={handleImageChange}
                        imageUrl={imageUrl}
                        imageData={imageData}
                        cid={cid}
                        loader={loader}
                        handleRedirect={handleRedirect}
                        setCid={setCid}
                    />
                    <ShowNFT
                        imageGallery={imageGallery}
                        imageLoader={imageLoader}
                    />
                </div>
            </div>
            {/* <div className="second__page">
                <Transfer />
            </div>{" "} */}
        </div>
    );
}
export default App;
