import React from "react";
import "./fileUpload.css";

function FileUpload({
    handleImageSubmit,
    imageUrl,
    userInput,
    cid,
    setCid,
    handleImageChange,
    loader,
    handleRedirect,
}) {
    return (
        <div className="file">
            <div className="text__file__holder">
                <div className="text">
                    <h2>Add NFT To Your Account</h2>{" "}
                    <p>Add Image File And Create NFT</p>
                </div>
                {/* file buttons here */}
                <div className="file__holder">
                    <div className="text__inputs">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            value={userInput.name}
                            onChange={(e) => {
                                handleImageChange(e);
                            }}
                        />
                        <textarea
                            cols="30"
                            rows="7"
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Description"
                            value={userInput.description}
                            onChange={(e) => {
                                handleImageChange(e);
                            }}
                        ></textarea>
                    </div>
                    <div className="file__upload">
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
                </div>
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
                    alt={userInput.name}
                />
            </div>
            {/* link */}
        </div>
    );
}

export default FileUpload;
