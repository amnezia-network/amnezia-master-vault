AMNEZIA MASTER VAULT — MVP (Minimum Viable Protocol)

Amnezia Master Vault es un sistema minimalista de identidad, trazabilidad y firma criptográfica para obras musicales, pensado como base para escalar a un futuro framework de tokenización y smart contracts.

El MVP actual funciona 100% local, sin depender de blockchain, para mantenerlo simple, auditable y entendible.
El sistema ya implementa la capa fundamental: creación del asset → generación del SyncToken → firma → verificación.

🔹 Componentes del sistema

vault-cli.js
Interfaz CLI donde el artista puede:

Crear tokens (uno por obra)

Firmarlos con su clave privada

Verificar firmas con la clave pública

Ver historial de cambios

createsynctoken.js
Genera SyncTokens compatibles con futuras integraciones blockchain.
Serialización estable → el archivo que se firma es EXACTAMENTE el que se verifica.

verifysync.js / verify.js
Scripts externos que permiten verificar un token sin usar el Vault, para mostrar portabilidad y confianza.

Estructura del token (.synctoken.json)

token_id

vault_version

hash de assets

derechos

timestamp
Esto es el equivalente a un NFT metadata, pero local y verificable antes de subir a una cadena.
