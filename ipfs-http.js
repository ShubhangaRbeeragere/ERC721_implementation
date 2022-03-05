import { create } from "ipfs-http-client";

try {
    const ipfs = create("http://localhost:4002");

    const file = await ipfs.add("hellol world");
    console.log(file);
} catch (error) {
    console.error("error occured---- ", error);
}
