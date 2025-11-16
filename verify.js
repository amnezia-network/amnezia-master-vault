import { readFileSync } from "fs";
import * as openpgp from "openpgp";

// Ruta a la clave pública
const PUBLIC_KEY_PATH = "./keys/public-key.asc";

async function verifyFile(filePath, sigPath) {
    const publicKeyArmored = readFileSync(PUBLIC_KEY_PATH, "utf8");
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const fileBuffer = readFileSync(filePath);
    const signature = readFileSync(sigPath, "utf8");

    try {
        const result = await openpgp.verify({
            message: await openpgp.createMessage({ binary: fileBuffer }),
            signature: await openpgp.readSignature({ armoredSignature: signature }),
            verificationKeys: publicKey
        });

        const validity = await result.signatures[0].verified;
        if (await validity) {
            console.log("✔ Firma válida. El archivo no fue modificado.");
        } else {
            console.log("✖ Firma inválida.");
        }
    } catch (err) {
        console.error("Error en la verificación:", err.message);
    }
}

const [, , filePath, sigPath] = process.argv;

if (!filePath || !sigPath) {
    console.error("Uso: node verify.js <archivo> <archivo.sig>");
    process.exit(1);
}

verifyFile(filePath, sigPath);
