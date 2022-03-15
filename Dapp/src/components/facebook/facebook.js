import React from "react";
import "./facebook.css";

function Facebook({ facebookLogin, facebookPosts }) {
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
                    <Images facebookPosts={facebookPosts} />
                </div>
                <div className="create__nft__button">Create NFT</div>
            </div>
        </>
    );
}

function Images({ facebookPosts, imageSelector }) {
    return (
        <div className="images">
            {facebookPosts.length > 0 ? (
                facebookPosts.map((imageURL, index) => {
                    return (
                        <div
                            className="span"
                            key={index}
                            onClick={() => {}}
                            onDoubleClick={() => {
                                const win = window.open(imageURL, "_blank");
                                if (!win) {
                                    win.focus();
                                }
                            }}
                        >
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
