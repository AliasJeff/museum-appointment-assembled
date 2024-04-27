const encryptionKey = "MuseumOfAfricanHeritageSecure123";

export async function encrypt(text) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 初始化向量
  const algo = { name: "AES-GCM", iv: iv };
  const keyData = new TextEncoder().encode(encryptionKey);
  const key = await crypto.subtle.importKey("raw", keyData, algo, false, [
    "encrypt",
  ]);
  const encoded = new TextEncoder().encode(text);
  const encrypted = await crypto.subtle.encrypt(algo, key, encoded);
  return { iv, encrypted };
}

export async function decrypt(iv, data) {
  const algo = { name: "AES-GCM", iv: iv };
  const keyData = new TextEncoder().encode(encryptionKey);
  const key = await crypto.subtle.importKey("raw", keyData, algo, false, [
    "decrypt",
  ]);
  const decrypted = await crypto.subtle.decrypt(algo, key, data);
  return new TextDecoder().decode(decrypted);
}
