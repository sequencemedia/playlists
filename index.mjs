import { glob } from 'glob'
import { readFile, writeFile } from 'node:fs/promises'

async function getFilePathList () {
  return await glob('./m3u8/**/*.m3u8')
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

function trim (line) {
  return line.trim()
}

function transform (fileData) {
  const alpha = fileData.toString().split(EOL).map(trim).filter(Boolean)
  const omega = []
  const [
    header
  ] = alpha

  let i = 1
  const j = alpha.length
  for (i, j; i < j; i = i + 2) {
    omega.push(alpha.slice(i, i + 2))
  }

  return Buffer.from(
    omega.sort(sort).reduce(reduce, [header]).map(trim).filter(Boolean).join(EOL)
  )
}

const EOL = '\r'

async function execute () {
  const filePathList = await getFilePathList()

  for (const filePath of genFileData(filePathList)) {
    await writeFile(filePath, transform(await readFile(filePath)))
  }
}

export default execute()
