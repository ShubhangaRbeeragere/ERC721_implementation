import React from "react";
import { useState } from "react";
import "./transfer.css";

function Transfer() {
    return (
        <div className="transfer__nft">
            <h1>Transfer Your NFT</h1>
            <div className="text">
                <h3>Select The Receiver To Send Your NFT</h3>

                <div className="account_selector"></div>
            </div>
        </div>
    );
}

export default Transfer;
