import { create } from "ipfs-core";
import { useEffect, useState } from "react";
import Web3 from "web3";
import ABI from "./ABI.json";
import Navigation from "./components/navigation/navigation";
import FileUpload from "./components/fileUpload/fileUpload";
import defaultImage from "./defaultImage.png";
import Message from "./components/messages/message";
import Facebook from "./components/facebook/facebook";
// import Transfer from "./components/transferNFT/transfer";
import ShowNFT from "./components/showNFT/showNFT";

function App() {
    //for storing image file entered by the user
    const [userInput, setUserInput] = useState({
        name: "",
        description: "",
        file: "",
    });
    //to store the blob of image file
    const [imageUrl, setImageUrl] = useState("");
    //to store the cid created using image file in ipfs
    const [cid, setCid] = useState("");
    //for controlling loading screen
    const [loader, setLoader] = useState(false);
    //for select menu for 'FROM' account
    let [fromAccount, setFromOptions] = useState("");
    //for image gallery
    let [imageGallery, setImageGallery] = useState([]);
    //for image gallery loading screen
    const [imageLoader, setImageLoader] = useState(false);

    //for facebook posts image gallery
    let [facebookPosts, setFacebookPosts] = useState();
    //for getting the selected images in facebook image gallery
    let [selectedPosts, setSelectedPosts] = useState([]);

    //to handle messages
    const [message, setMessage] = useState({
        data: "message will be shown here",
        visible: false,
    });
    //initialize web3
    let web3 = new Web3("HTTP://127.0.0.1:7545");
    let contract = new web3.eth.Contract(
        ABI,
        "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
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
            } else {
                throw new Error("You need to install Metamask");
            }
        } catch (err) {
            console.log(err);
            setMessage({ data: err.message, visible: true });
        }
    };

    let MetamaskAccountChangeHandler = async (account) => {
        // console.log("switched to account ", account[0]);
        setUserInput({ file: "", name: "", description: "" });
        setImageUrl(defaultImage);
        setFromOptions(account[0]);
        if (account[0]) {
            getAllNFT(account[0]);
        }
    };
    //for facebook /////////////////////////////////////////////////////////////////////////
    let facebookLogin = () => {
        window.FB.getLoginStatus(function (response) {
            console.log(response);
            if (response.status === "connected") {
                console.log("already connected");
                getPosts();
            } else {
                window.FB.login((response) => {
                    if (response.status === "connected") {
                        console.log("you are logged in");
                    } else {
                        console.error("login failed");
                    }
                });
            }
        });
    };

    let getPosts = () => {
        console.log("getting data....");
        window.FB.api(
            "/me/posts",
            "GET",
            { fields: "full_picture", limit: 20 },
            function (response) {
                let posts = [];
                console.log(response);
                for (let url of response.data) {
                    if (url.full_picture) {
                        posts.push(url.full_picture);
                    }
                }
                setFacebookPosts(posts);
            }
        );
    };

    //web3 ///////////////////////////////////////////////////////////////////////////////////
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
        // console.log("address ", address, " token ", tokenURI);
        contract.methods
            .mintNFT(address, tokenURI)
            .send({
                from: address,
                gas: 800000,
            })
            .on("receipt", (data) => {
                console.log("--nft mint successfull--");
                setMessage({ data: "nft mint successfull", visible: true });
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
                    setMessage({ data: err.message, visible: true });
                }
            });
    };
    //get all the NFTs of the address
    let getAllNFT = async (address) => {
        try {
            //set screen loader while getting the images
            setImageLoader(true);
            let balance = await balanceOf(address);
            console.log("getting nfts");
            setMessage({ data: "fetching NFTs.....", visible: true });
            let tokenURIarray = [];
            for (let index = 0; index < balance; index++) {
                let tokenId = await contract.methods
                    .tokenOfOwnerByIndex(address, index)
                    .call();

                //tokenURI will be a json string file,
                //{"name": "", "description": "", "image": "url"}
                let tokenURI = await contract.methods.tokenURI(tokenId).call();
                // console.log("token URI ", tokenURI);
                let tokenURIJson = JSON.parse(tokenURI);
                //use only the image URL for imageGallery
                tokenURIarray.push(tokenURIJson.image);
            }

            // console.log("all your tokens", tokenURIarray);
            // console.log("token URI of ", address, " is ", tokenURIarray);
            setImageGallery(tokenURIarray);
            //remove screen loader
            setImageLoader(false);
            setMessage({ ...message, visible: false });
        } catch (err) {
            console.log("--error--getAllNFT--", err);
            setMessage({ data: err.message, visible: true });
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
            setMessage({ data: err.message, visible: true });
        }
    };

    let totalBalance = async (address) => {
        try {
            let balance = await contract.methods.totalSupply().call();
            // console.log(balance);
        } catch (error) {
            console.log("--error--totalBalance--", error);
        }
    };
    //get all the accounts in the smart-contract
    let getAccounts = async () => {
        let accounts = [];
        try {
            accounts = await web3.eth.getAccounts();
            setFromOptions(accounts[0]);
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
        //initialize facebook
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: "245284471060624",
                cookie: true,
                xfbml: true,
                version: "v13.0",
            });

            window.FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk");

        //metamask
        initializeMetamask().then((acc) => {
            setFromOptions(acc[0]);
        });
        //set default image
        setImageUrl(defaultImage);

        //when the user selects a different account in metamask
        if (window.ethereum !== undefined) {
            window.ethereum.on("accountsChanged", MetamaskAccountChangeHandler);
        }
        return function cleanUp() {
            //remove the event listener
            if (window.ethereum) {
                window.ethereum.removeListener(
                    "accountsChanged",
                    MetamaskAccountChangeHandler
                );
            }
        };
    }, []);

    useEffect(() => {
        if (fromAccount) {
            getAllNFT(fromAccount);
        }
    }, [fromAccount]);

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
            //metaData format to store the data to block chain
            let metaData = {
                name: userInput.name,
                description: userInput.description,
                image: "",
            };
            if (
                userInput.description === "" ||
                userInput.name === "" ||
                userInput.file === ""
            ) {
                throw new Error("You Can't Leave Any Of The Inputs Empty");
            }
            //set loading screen
            setLoader(true);
            const ipfs = await create({ repo: "ok" + Math.random() });
            //add the image blob to ipfs
            const { cid } = await ipfs.add(userInput.file);
            const pinData = await ipfs.pin.add(cid);
            //pin the cid
            if (pinData === cid) console.log("pinning successfull");
            else console.error("pinning error");
            //////
            setCid(cid.toString());
            setLoader(false);

            //mint NFT
            metaData.image = `https://ipfs.io/ipfs/${cid}`;
            console.log("minting......");
            // console.log("metadata ", JSON.stringify(metaData));
            setMessage({ data: "minting...", visible: true });
            mintNFT(fromAccount, JSON.stringify(metaData));
        } catch (err) {
            setMessage({ data: err.message, visible: true });
        }
    };
    let handleImageChange = (e) => {
        //get the file uploaded by the user

        if (e.target.name === "name" || e.target.name === "description") {
            setUserInput({ ...userInput, [e.target.name]: e.target.value });
        }

        if (e.target.files) {
            // console.log("files updating....", e.target.files[0]);
            setUserInput({ ...userInput, file: e.target.files[0] });
            //to display the image as preview by creating blob
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
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
                <Navigation fromAccount={fromAccount} />
                <div className="file__nft__holder">
                    <FileUpload
                        handleImageSubmit={handleImageSubmit}
                        handleImageChange={handleImageChange}
                        imageUrl={imageUrl}
                        userInput={userInput}
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
            <div className="second__page">
                <Facebook
                    facebookLogin={facebookLogin}
                    facebookPosts={facebookPosts}
                    selectedPosts={selectedPosts}
                    setSelectedPosts={setSelectedPosts}
                />
            </div>
            <Message message={message} setMessage={setMessage} />
        </div>
    );
}
export default App;
