import React from "react";
import "./showNFT.css";
function ShowNFT({ imageGallery }) {
    return (
        <div className="nft">
            <h4>Your NFTs</h4>
            <Images imageGallery={imageGallery} />
        </div>
    );
}

function Images({ imageGallery }) {
    return (
        <div className="image__gallery">
            {imageGallery.map((tokenURI, index) => {
                return (
                    <div className="span" key={index}>
                        <img src={tokenURI} alt="" />
                    </div>
                );
            })}
        </div>
    );
}

export default ShowNFT;
