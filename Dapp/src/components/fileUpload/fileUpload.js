import React from "react";
import "./fileUpload.css";

function FileUpload({
    handleImageSubmit,
    imageUrl,
    imageData,
    cid,
    setCid,
    handleImageChange,
    loader,
    handleRedirect,
}) {
    return (
        <div className="file">
            <div className="text">Add Image File And Create NFT</div>
            {/* file buttons here */}
            <div className="file__holder">
                <label
                    htmlFor="files"
                    className="add__file"
                    onClick={() => {
                        setCid("");
                    }}
                >
                    Add File
                </label>
                <input
                    type="file"
                    id="files"
                    name="image"
                    onChange={(e) => {
                        handleImageChange(e);
                    }}
                />
                <button
                    onClick={() => {
                        handleImageSubmit();
                    }}
                >
                    Create NFT
                </button>
            </div>
            {/* image */}

            <div
                className={`image__holder ${
                    loader
                        ? "image--loader"
                        : cid.length > 0
                        ? "image__hover"
                        : ""
                }`}
                onClick={(e) => {
                    handleRedirect(e);
                }}
            >
                <img
                    src={imageUrl.length > 0 ? imageUrl : "#"}
                    alt={imageData.name}
                />
            </div>
            {/* link */}
        </div>
    );
}

export default FileUpload;
