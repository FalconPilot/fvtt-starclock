import * as gulp from 'gulp'
import * as gulpTS from 'gulp-typescript'

const project = gulpTS.createProject('tsconfig.json')

const compileTS = () => [
  'module',
]
  .forEach(folder =>
    gulp.src(`src/${folder}/**/*.ts`)
      .pipe(project())
      .pipe(gulp.dest(`dist/${folder}`))
  )

export default gulp.series(
  compileTS
)
