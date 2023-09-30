import { glob } from 'glob'
import { readFile, writeFile } from 'node:fs/promises'
import { PATH } from './config/index.mjs'

async function getFilePathList () {
  return await glob(`${PATH}/**/*.m3u8`)
}

function * genFileData (filePathList) {
  while (filePathList.length) {
    yield filePathList.shift()
  }
}

function sort ([a, b], [c, d]) {
  return b.localeCompare(d)
}

function reduce (accumulator, lines) {
  return accumulator.concat(lines)
}

function trim (line = '') {
  return line.trim()
}

function transform (fileData) {
  const s = fileData.toString('utf8')

  const alpha = (s.includes(CR) ? s.split(CR) : s.split(LF)).map(trim).filter(Boolean)
  const omega = []

  let i = 1
  const j = alpha.length
  for (i, j; i < j; i = i + 2) {
    omega.push(alpha.slice(i, i + 2))
  }

  const [
    header
  ] = alpha

  return Buffer.from(
    omega.sort(sort).reduce(reduce, [header]).map(trim).filter(Boolean).join(LF) + LF
  )
}

const CR = '\r'
const LF = '\n'

async function execute () {
  const filePathList = await getFilePathList()
  for (const filePath of genFileData(filePathList)) {
    await writeFile(filePath, transform(await readFile(filePath)))
  }
}

export default execute()
