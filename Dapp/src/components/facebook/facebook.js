import React, { useEffect } from "react";
import "./facebook.css";
import TickBox from "./tickBox.png";

function Facebook({
    facebookLogin,
    facebookPosts,
    selectedPosts,
    setSelectedPosts,
}) {
    return (
        <>
            <div className="left">
                <p className="instructions">
                    click on the Login Button to Login to your facebook account
                    and retrive all your posts. <br />
                    <br /> choose the images from the posts to convert to NFT
                </p>
                <div
                    className="login__button"
                    onClick={() => {
                        facebookLogin();
                    }}
                >
                    Login To Facebook
                </div>
            </div>
            <div className="right">
                <div className="image__gallery">
                    <h4 className="heading">Select The Images</h4>
                    <Images
                        facebookPosts={facebookPosts}
                        setSelectedPosts={setSelectedPosts}
                        selectedPosts={selectedPosts}
                    />
                </div>
                <div className="create__nft__button">Create NFT</div>
            </div>
        </>
    );
}

function Images({ facebookPosts, selectedPosts, setSelectedPosts }) {
    return (
        <div className="images">
            {facebookPosts.length > 0 ? (
                facebookPosts.map((imageURL, index) => {
                    return (
                        <div
                            className="span"
                            key={index}
                            onClick={() => {
                                console.log(selectedPosts);
                                setSelectedPosts((prev) => [...prev, imageURL]);
                            }}
                            onDoubleClick={() => {
                                const win = window.open(imageURL, "_blank");
                                if (!win) {
                                    win.focus();
                                }
                            }}
                        >
                            {selectedPosts.includes(imageURL) ? (
                                <span className="tickBox__wrapper">
                                    {console.log("exists")}
                                    <img
                                        src={TickBox}
                                        alt="tick"
                                        className="click__tick"
                                    ></img>
                                </span>
                            ) : (
                                ""
                            )}
                            <img src={imageURL} alt="" />
                        </div>
                    );
                })
            ) : (
                <h3>Login To Get Your Posts</h3>
            )}
        </div>
    );
}
export default Facebook;
