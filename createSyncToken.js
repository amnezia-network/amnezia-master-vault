const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function createSyncToken(vaultIndexPath) {
    if (!fs.existsSync(vaultIndexPath)) {
        console.error("❌ No se encontró vault_index:", vaultIndexPath);
        process.exit(1);
    }

    const vaultIndex = JSON.parse(fs.readFileSync(vaultIndexPath, "utf8"));
    const tokenId = crypto.randomUUID();

    const token = {
        token_id: tokenId,
        vault_version: vaultIndex.vault_version,
        asset_count: vaultIndex.assets.length,
        assets: vaultIndex.assets.map(a => ({
            id: a.id,
            type: a.type,
            version: a.version,
            hash: a.hash
        })),
        issued_at: new Date().toISOString(),
        rights: {
            owner: "AMNEZIA",
            transferable: false
        }
    };

    // SERIALIZACIÓN ESTABLE Y EXACTA
    const serialized = JSON.stringify(token, null, 4);

    // BYTES EXACTOS PARA FIRMAR
    const tokenBytes = Buffer.from(serialized, "utf8");

    const tokensDir = "tokens";
    if (!fs.existsSync(tokensDir)) fs.mkdirSync(tokensDir);

    const filename = path.join(tokensDir, `${tokenId}.synctoken.json`);

    // GUARDAR LOS MISMOS BYTES QUE SE FIRMARÁN
    fs.writeFileSync(filename, tokenBytes);

    console.log("✔ SyncToken generado en:", filename);
}

if (process.argv.length < 3) {
    console.log("Uso: node createSyncToken.js <ruta_vault_index.json>");
    process.exit(1);
}

createSyncToken(process.argv[2]);
