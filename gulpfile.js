const gulp = require('gulp')
const gulpTS = require('gulp-typescript')
const fs = require('fs')
const path = require('path')
const Datastore = require('nedb')
const mergeStream = require('merge-stream')
const through2 = require('through2')

const project = gulpTS.createProject('tsconfig.json')

const dbJSONPath = 'packs/src'
const dbPath = 'packs'

const dbCache = {}

const compileTS = () =>
  gulp.src('src/**/*.{ts,js}')
    .pipe(project())
    .pipe(gulp.dest('dist/'))

const overrideField = (src, field, override) => {
  const data = Object.assign({}, src)
  if (data[field]) {
    data[field] = override
  }

  return data
}

const getID = (data, packName) => {
  const dbFilePath = `${dbPath}/${packName}.db`
  if (!dbCache[dbFilePath]) {
    dbCache[dbFilePath] = new Datastore({ filename: dbFilePath, autoload: true })
    dbCache[dbFilePath].loadDatabase()
  }

  const db = dbCache[dbFilePath]

  return new Promise((resolve, reject) => {
    db.findOne({ name: data.name }, (err, entry) => {
      if (entry) {
        resolve(entry._id)
      } else {
        resolve(db.createNewId())
      }
    })
  })
}

const cleanJSON = src => {
  const data = Object.assign({}, src)
  return Object.entries({
    permission: { default: 0 }
  }).reduce((acc, [k, v]) => overrideField(acc, k, v), data)
}

const compileDB = async () => {
  const packs = await fs.readdirSync(dbJSONPath, { withFileTypes: true })
    .filter(file => file.isDirectory())
    .map(folder => {
      const packName = folder.name
      const filePath = `${dbPath}/${packName}.db`
      console.log(`StarClock > Compiling ${filePath}`)

      const data = []

      return gulp.src(path.join(dbJSONPath, packName, '/**/*.json'))
        .pipe(through2.obj((file, enc, callback) => {
          const fileData = JSON.parse(file.contents.toString())
          console.log(`StarClock > ${filePath} > ${fileData.name}`)
          getID(fileData, packName)
            .then(_id => {
              data.push(cleanJSON({
                _id,
                type: packName,
                ...fileData
              }))
              callback(null, file)
            })
        }, cb => {
          fs.rmSync(filePath, { force: true })
          const dbFile = fs.createWriteStream(filePath, { flags: 'a', mode: 0o664 })
          data
            .sort((a, b) => a._id > b._id ? 1 : -1)
            .forEach(entry => dbFile.write(JSON.stringify(entry) + '\n'), cb)
        }))
    })

  return await mergeStream.call(null, packs)
}

exports.build = gulp.series(
  compileTS
)

exports.db = gulp.series(
  compileDB
)

exports.watch = () => {
  gulp.watch(['src/**/*.{ts,js}'], {}, exports.build)
}
