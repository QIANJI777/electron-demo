const crypto = require('crypto')
const enc = {
  defaults: {
    cipher: 'aes',
    bit_len: '256',
    iv_len: 32, // 128bits
    tag_len: 16,
    encode: 'hex',
    digest: 'sha512',
    secret: 'I'.repeat(32), // 密匙长 256bits = 32bytes
    iv: Buffer.alloc(16, 0),  // 偏移量 16bytes
  },
  encrypt: function (text) {
    try {
      const cipher = crypto.createCipheriv(
          [enc.defaults.cipher, enc.defaults.bit_len, 'cbc'].join('-'),
          enc.defaults.secret,
          enc.defaults.iv
        ),
        encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
      //  encrypted = Buffer.concat([cipher.update(text, 'utf8', 'hex'), cipher.final('hex')])
      return encrypted
    } catch (err) {
      if (err) {
        return console.error(err)
      }
    }
  },
  decrypt: function (encdata) {
    try {
      const decipher = crypto.createDecipheriv(
          [enc.defaults.cipher, enc.defaults.bit_len, 'cbc'].join('-'),
          enc.defaults.secret,
          enc.defaults.iv
        ),
        decrypted = decipher.update(encdata, 'hex', 'utf8') + decipher.final('utf8')
      return decrypted
    } catch (err) {
      if (err) {
        return console.error(err)
      }
    }
  },
  genkey: function (secret, length = 32) {
    return crypto.createHash('sha256').update(String(secret)).digest('base64').substring(0, length)
  },
  keygen: function (len, iter) {
    return crypto
      .pbkdf2Sync(crypto.randomBytes(len), crypto.randomBytes(len), iter, len, enc.defaults.digest)
      .toString(enc.defaults.encode)
  },
}

module.exports = enc
