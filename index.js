const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const { COPYFILE_EXCL } = fs.constants

const CAMERA_IMAGES_PATH = '/Volumes/Untitled/DCIM/100MSDCF'
const DESTINATION_PATH = '/Users/tiki/Dropbox/sony-camera'

const maybeMakeFolder = path => {
  try {
    fs.readdirSync(path)
  } catch (e) {
    console.log(`Making folder: ${path}`)
    fs.mkdirSync(path)
  }
}

const move = (src, dest) => ([filename, stat]) => {
  const d = new Date(stat.birthtime)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, 0)
  const day = String(d.getDate()).padStart(2, 0)
  const srcPath = `${src}/${filename}`

  // TODO: Make this some badass recursive function.
  maybeMakeFolder(`${dest}/${year}`)
  maybeMakeFolder(`${dest}/${year}/${month}`)
  maybeMakeFolder(`${dest}/${year}/${month}/${year}-${month}-${day}`)

  const destPath = `${dest}/${year}/${month}/${year}-${month}-${day}/${filename}`

  try {
    fs.copyFileSync(srcPath, destPath, COPYFILE_EXCL)
    console.log(`Copied ${srcPath} => ${destPath}.`)
  } catch (e) {
    console.log(e)
  }
}

async function main() {
  const files = fs
    .readdirSync(CAMERA_IMAGES_PATH)
    .map(filename => [
      filename,
      fs.statSync(`${CAMERA_IMAGES_PATH}/${filename}`)
    ])

  try {
    fs.readdirSync(DESTINATION_PATH)
    console.log(`Copying images to: ${DESTINATION_PATH}`)
    files.forEach(move(CAMERA_IMAGES_PATH, DESTINATION_PATH))
  } catch (e) {
    console.log(`Destination doesn't exist: ${DESTINATION_PATH}`)
  }
}

main()
