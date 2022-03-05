import * as IPFS from "ipfs-core";
import image from "./nature.jpg";

console.log("image", image);
const ipfs = await IPFS.create();

try {
    // let config = await ipfs.config.get();
    // console.log("config ", config);

    const { cid } = await ipfs.add({
        path: "files",
        content: "hellwrld",
    });

    console.info(cid);

    // const peerInfos = await ipfs.swarm.peers();
    // console.log("swarm ", peerInfos);
    // const c = await ipfs.pin.add(
    //     "QmeKUgNGsLfqXyaEBJs5dvuFQapAFK8KfSwUcJqU7Edat8"
    // );
    // console.log("pinned ", c);
} catch (error) {
    console.error(error);
}
