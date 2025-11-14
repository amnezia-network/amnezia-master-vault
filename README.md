# amnezia-master-vault
Amnezia Master Vault

Seguridad real. Control total. Tu obra, para siempre.

🧩 One-liner técnico

Amnezia Master Vault crea un registro inmutable de cada obra y gestiona automáticamente la propiedad y los splits usando firmas digitales verificables.

❗ Problem Statement

Los artistas no tienen una forma segura, simple e inmutable de demostrar autoría ni de gestionar splits sin depender de terceros.
Eso genera disputas, pérdidas de ingresos y cero transparencia.

💡 Solution Statement

Amnezia Master Vault permite registrar cualquier obra en un sistema inmutable y verificable.
El ownership queda firmado digitalmente, los splits se fijan desde el inicio y nadie puede alterarlos ni discutirlos.

🔑 Key Features

Registro inmutable de autoría
Hash único + firma digital para cada obra.

Ownership y splits automáticos
Porcentajes definidos al inicio, sin disputas posteriores.

Verificación pública sin exponer la obra
Cualquiera valida existencia y propiedad sin acceder al archivo real.

🏗 Arquitectura Simplificada

Firma y hash de la obra
El usuario sube un archivo → se genera SHA-256 → se firma digitalmente.

Registro inmutable (ledger)
Se almacena hash + timestamp + ownership + splits en un storage append-only.

Verificación instantánea
Un QR o link permite validar existencia, autoría y splits.

🧭 User Flow

Artista sube su obra.

Define ownership y splits.

Se genera el hash y se firma.

Se registra en el ledger inmutable.

Se genera un certificado verificable.

Cualquiera puede validar sin exponer la obra.

🚀 MVP construido en la hackathon

Generación de hash (SHA-256) a partir de cualquier archivo.

Firma digital simple del hash.

Ledger inmutable (JSON append-only o smart contract simple en testnet).

Certificado verificable (QR o link).

Bonus: Verificador online de existencia + propiedad (si hay tiempo).

🛠 Stack Tecnológico (sugerido)

Node.js o Python.

HTML + JS minimalista.

Ledger en JSON append-only (o contrato básico en testnet).

🗣 Pitch (2 minutos)

Problema:
Los artistas no tienen una forma segura, simple e inmutable de demostrar autoría. Dependen de terceros o capturas de pantalla. Eso genera disputas y pérdida de ingresos.

Solución:
Amnezia Master Vault registra obras con hash + firma digital y fija splits desde el inicio. Genera un certificado verificable e imposible de alterar.

Cómo funciona:
Subís tu obra → se genera un hash único y se firma → se registra en un ledger inmutable → obtenés un certificado verificable sin exponer tu archivo.

MVP:
Hash + firma + ledger + certificado QR.
Y un verificador de existencia.

Impacto:
Elimina disputas, da transparencia a los splits y protege la autoría de forma simple y segura.

📩 Contacto

Proyecto Hackathon — Amnezia
