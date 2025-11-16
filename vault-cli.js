const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const readline = require("readline");

const TOKENS_DIR = "tokens";
const SIGNATURES_DIR = "tokens/signatures";
const HISTORY_PATH = "vault-history.json";
const PRIVATE_KEY_PATH = "keys/private.pem";
const PUBLIC_KEY_PATH = "keys/public.pem";

// ------------------------
// Helpers
// ------------------------
function ensureDirs() {
    if (!fs.existsSync(TOKENS_DIR)) fs.mkdirSync(TOKENS_DIR, { recursive: true });
    if (!fs.existsSync(SIGNATURES_DIR)) fs.mkdirSync(SIGNATURES_DIR, { recursive: true });
    if (!fs.existsSync(HISTORY_PATH)) fs.writeFileSync(HISTORY_PATH, "[]");
}

function prompt(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, ans => {
        rl.close();
        resolve(ans);
    }));
}

function logHistory(action, fileName) {
    const history = JSON.parse(fs.readFileSync(HISTORY_PATH));
    history.push({
        action,
        file: fileName,
        timestamp: new Date().toISOString()
    });
    fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
}

// ------------------------
// Fix: listado para selección numérica
// ------------------------
function listTokensForSelection() {
    const files = fs.readdirSync(TOKENS_DIR).filter(f => f.endsWith(".synctoken.json"));

    const items = files.map(f => ({
        id: f.replace(".synctoken.json", ""),
        file: f
    }));

    console.log("\n=== Verificar token ===");
    items.forEach((t, i) => {
        console.log(`${i + 1}) ${t.file}`);
    });

    return items;
}

// ------------------------
// 1) Crear token
// ------------------------
async function createToken() {
    console.clear();
    console.log("=== Crear nuevo token ===");

    const name = await prompt("Nombre de la obra: ");
    const contentRef = await prompt("Archivo o referencia (WAV, letra, etc): ");

    const id = crypto.randomUUID();
    const tokenPath = `${TOKENS_DIR}/${id}.synctoken.json`;

    const token = {
        token_id: id,
        name: name,
        vault_version: 1,
        issued_at: new Date().toISOString(),
        ref: contentRef
    };

    fs.writeFileSync(tokenPath, JSON.stringify(token, null, 2));
    logHistory("CREATED", tokenPath);

    console.log("\n✔ Token creado en:", tokenPath);
}

// ------------------------
// 2) Firmar token
// ------------------------
async function signToken() {
    console.clear();
    console.log("=== Firmar token existente ===");

    const files = fs.readdirSync(TOKENS_DIR).filter(f => f.endsWith(".synctoken.json"));

    if (files.length === 0) {
        console.log("No hay tokens.");
        return;
    }

    files.forEach((f, i) => console.log(`${i + 1}) ${f}`));
    const n = parseInt(await prompt("\nElegí un token para firmar: "));

    if (!files[n - 1]) return console.log("Opción inválida.");

    const tokenPath = `${TOKENS_DIR}/${files[n - 1]}`;
    const signaturePath = `${SIGNATURES_DIR}/${files[n - 1]}.signature`;

    const tokenData = fs.readFileSync(tokenPath);
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");

    const signature = crypto.sign("sha256", tokenData, {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING
    }).toString("base64");

    fs.writeFileSync(signaturePath, signature);
    logHistory("SIGNED", signaturePath);

    console.log("\n✔ Token firmado!");
    console.log("Firma guardada en:", signaturePath);
}

// ------------------------
// 3) Verificar token (con selección numerada correcta)
// ------------------------
async function verifyToken() {
    console.clear();
    console.log("=== Verificar token ===");

    // usa el listado preparado para selección numérica
    const items = listTokensForSelection();
    if (!items || items.length === 0) {
        console.log("No hay tokens.");
        return;
    }

    const n = parseInt(await prompt("\nElegí un token para verificar: "));
    const selected = items[n - 1];

    if (!selected) {
        console.log("Opción inválida.");
        return;
    }

    // paths concretos usando el nombre de archivo listado
    const tokenPath = path.join(TOKENS_DIR, selected.file);
    const signaturePath = path.join(SIGNATURES_DIR, `${selected.file}.signature`);

    if (!fs.existsSync(tokenPath)) {
        console.log("\n❌ Token no encontrado:", tokenPath);
        return;
    }

    if (!fs.existsSync(signaturePath)) {
        console.log("\n❌ No existe firma para este token.");
        return;
    }

    // Leer token como Buffer (sin encoding) — importante para verificación binaria exacta
    const tokenData = fs.readFileSync(tokenPath);
    // Firma como string base64 (trim para quitar saltos)
    const signature = fs.readFileSync(signaturePath, "utf8").trim();
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");

    const verifier = crypto.createVerify("SHA256");
    verifier.update(tokenData);
    verifier.end();

    const valid = verifier.verify(publicKey, signature, "base64");

    console.log("\n────────────────────────");
    console.log(valid ? "✔ Firma válida" : "❌ Firma inválida");
    console.log("────────────────────────\n");

    if (valid) {
        logHistory("VERIFIED", tokenPath);
        console.log("Contenido token:");
        console.log(JSON.parse(tokenData));
    } else {
        console.log("Consejos rápidos si sigue fallando:\n");
        console.log("- Asegurate que la firma corresponde exactamente a ese token (mismo archivo).");
        console.log("- Verificá que la firma sea base64 sin saltos extras ni espacios.");
        console.log("- Verificá que public.pem corresponde a la private.pem usada para firmar.");
    }
}

// ------------------------
// 4) Listar tokens
// ------------------------
function listTokens() {
    console.clear();
    console.log("=== Listado de tokens ===\n");

    const files = fs.readdirSync(TOKENS_DIR).filter(f => f.endsWith(".synctoken.json"));

    if (files.length === 0) {
        console.log("No hay tokens creados aún.");
        return;
    }

    for (const f of files) {
        const data = JSON.parse(fs.readFileSync(`${TOKENS_DIR}/${f}`));
        console.log(`• ${data.name} | ID: ${data.token_id}`);
        console.log(`  Fecha: ${data.issued_at}`);
        console.log(`  Ref: ${data.ref}`);
        console.log("");
    }
}

// ------------------------
// 5) Historial
// ------------------------
function showHistory() {
    console.clear();
    console.log("=== Historial del Vault ===\n");

    const history = JSON.parse(fs.readFileSync(HISTORY_PATH));

    if (history.length === 0) return console.log("Historial vacío.");

    history.forEach(h => {
        console.log(`[${h.timestamp}] ${h.action} → ${h.file}`);
    });
}

// ------------------------
// MAIN MENU
// ------------------------
async function mainMenu() {
    ensureDirs();

    while (true) {
        console.clear();
        console.log("=== AMNEZIA MASTER VAULT – CLI ===");
        console.log("1) Crear nuevo token");
        console.log("2) Firmar token existente");
        console.log("3) Verificar token");
        console.log("4) Listar tokens");
        console.log("5) Ver historial");
        console.log("6) Salir\n");

        const choice = await prompt("Elegí una opción: ");
        switch (choice.trim()) {
            case "1": await createToken(); break;
            case "2": await signToken(); break;
            case "3": await verifyToken(); break;
            case "4": listTokens(); break;
            case "5": showHistory(); break;
            case "6": process.exit(0);
            default: console.log("Opción inválida."); break;
        }

        await prompt("\nEnter para continuar...");
    }
}

mainMenu();
