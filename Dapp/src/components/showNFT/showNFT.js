import React from "react";
import "./showNFT.css";
function ShowNFT({ imageGallery, imageLoader }) {
    return (
        <div className="nft">
            <h3 className="nft__heading">Your NFTs</h3>
            <Images imageGallery={imageGallery} imageLoader={imageLoader} />
        </div>
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

export default ShowNFT;
