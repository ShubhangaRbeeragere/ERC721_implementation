import React from "react";
import "./facebook.css";

function Facebook() {
    return (
        <>
            <div className="left">
                <p className="instructions">
                    click on the Login Button to Login to your facebook account
                    and retrive all your posts. <br />
                    <br /> choose the images from the posts to convert to NFT
                </p>
                <div className="login__button">Login To Facebook</div>
            </div>
            <div className="right">
                <div className="image__gallery">
                    <h4 className="heading">Select The Images</h4>
                    <div className="images"></div>
                </div>
                <div className="create__nft__button"></div>
            </div>
        </>
    );
}

function Images({ imageGallery, imageLoader }) {
    return (
        <div
            className={
                imageLoader
                    ? "image__gallery image__gallery__loading"
                    : "image__gallery"
            }
        >
            {imageGallery.length > 0 ? (
                imageGallery.map((tokenURI, index) => {
                    return (
                        <div
                            className="span"
                            key={index}
                            onClick={() => {
                                const win = window.open(tokenURI, "_blank");
                                if (!win) {
                                    win.focus();
                                }
                            }}
                        >
                            <img src={tokenURI} alt="" />
                        </div>
                    );
                })
            ) : (
                <h3>You Don't Have Any NFT</h3>
            )}
        </div>
    );
}
export default Facebook;
