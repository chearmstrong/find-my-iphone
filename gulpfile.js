const gulp = require('gulp');
const zip = require('gulp-zip');
const merge = require('merge-stream');
const del = require('del');

gulp.task('clean', () => {
  return del([
    'lambda-dist/**/*'
  ]);
});

gulp.task('build', ['clean'], () => {
    let index = gulp.src('index.js')
        .pipe(gulp.dest('lambda-dist'));
    let modules = gulp.src('node_modules/**')
        .pipe(gulp.dest('lambda-dist/node_modules'));

    return merge(index, modules);
});

gulp.task('zip', ['build'], () => {
    return gulp.src('lambda-dist/**/*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('lambda-dist'));
});

gulp.task('default', ['zip']);