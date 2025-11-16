const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const PUBLIC_KEY_PATH = "keys/public.pem";

function verifySync(tokenPath, signaturePath) {
    if (!fs.existsSync(tokenPath)) {
        console.error("❌ Token no encontrado:", tokenPath);
        process.exit(1);
    }
    if (!fs.existsSync(signaturePath)) {
        console.error("❌ Firma no encontrada:", signaturePath);
        process.exit(1);
    }

    const tokenData = fs.readFileSync(tokenPath, null);
    const signature = fs.readFileSync(signaturePath).toString().trim();
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");

    const verifier = crypto.createVerify("SHA256");
    verifier.update(tokenData);
    verifier.end();

    const valid = verifier.verify(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING
        },
        signature,
        "base64"
    );

    console.log("──────────────────────────");
    console.log(valid ? "✔ Firma válida" : "❌ Firma inválida");
    console.log("──────────────────────────");

    if (!valid) process.exit(1);

    const tokenJSON = JSON.parse(tokenData);

    console.log("Token ID:", tokenJSON.token_id);
    console.log("Vault version:", tokenJSON.vault_version);
    console.log("Issued at:", tokenJSON.issued_at);
}

if (process.argv.length < 4) {
    console.log("Uso: node verifySync.js <token> <signature>");
    process.exit(1);
}

verifySync(process.argv[2], process.argv[3]);
