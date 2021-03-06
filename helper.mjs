
import { readFileSync } from 'fs'
import { createConnection } from 'net'
import { createHash } from 'crypto'

export function loadFile (path) {
  try {
    return readFileSync(path, { encoding: 'utf8' })
  } catch (err) {
    return null
  }
}

export function parseJSON (str) {
  try {
    return JSON.parse(str)
  } catch (err) {
    return null
  }
}

// https://www.openssl.org/docs/man1.1.1/man3/EVP_BytesToKey.html
export function EVP_BytesToKey (data, keyLen, ivLen = 0) {
  let m = []
  let d = ''
  let count = 0
  do {
    d = createHash('md5').update(d).update(data).digest()
    m.push(d)
    count += d.length
  } while (count < keyLen + ivLen)
  m = Buffer.concat(m)
  const key = m.slice(0, keyLen)
  const iv = m.slice(keyLen, keyLen + ivLen)
  return { key, iv }
}

export function createAndConnect (port, addr) {
  return new Promise((resolve, reject) => {
    const sock = createConnection(port, addr)
    sock.once('connect', () => resolve(sock))
    sock.once('error', (err) => reject(err))
  })
}

export const inetNtoa = (buf) => `${buf[0]}.${buf[1]}.${buf[2]}.${buf[3]}`

export function inetNtop (buf) {
  const a = []
  for (let i = 0; i < 16; i += 2) { a.push(buf.readUInt16BE(i).toString(16)) }
  return a.join(':')
}
