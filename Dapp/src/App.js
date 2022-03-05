import { create } from "ipfs-core";
import { useState } from "react";
import Web3 from "web3";
import ABI from "./ABI.json";
import Navigation from "./components/navigation/navigation";
import FileUpload from "./components/fileUpload/fileUpload";
import Transfer from "./components/transferNFT/transfer";

function App() {
    //for storing image file entered by the user
    const [imageData, setImageData] = useState("");
    //to store the blob of image file
    const [imageUrl, setImageUrl] = useState("");
    //to store the cid created using image file in ipfs
    const [cid, setCid] = useState("");
    //for controlling loading screen
    const [loader, setLoader] = useState(false);

    //initialize web3
    let web3 = new Web3("HTTP://127.0.0.1:7546");
    let contract = new web3.eth.Contract(
        ABI,
        "0x20e96ee0C6D644580CFfb8BeD6C7dc48265c5d86"
    );

    //mint NFT for the user

    //acual code starts from here
    let connection = async () => {
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
        } catch (err) {
            console.error("error-----", err);
        }
    };

    let handleImageSubmit = () => {
        connection();
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
                <Navigation />
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
            </div>
            <div className="second__page">
                <Transfer />
            </div>{" "}
        </div>
    );
}
//contract address: 0x20e96ee0C6D644580CFfb8BeD6C7dc48265c5d86
//network ID: 5777
export default App;
