const gulp = require('gulp');
const sass = require('gulp-sass');
const cssmin = require('gulp-clean-css');
const rename = require('gulp-rename');

gulp.task('wxss', () => {
  return gulp.src(['../src/**/*.scss'])
      .pipe(sass())
      .pipe(cssmin())
      .pipe(rename((path) => {
          path.extname = '.wxss';
      }))
      .pipe(gulp.dest('../dist/'))
});

gulp.task('js', () => {
  return gulp.src(['../src/**/*.js'])
      .pipe(gulp.dest('../dist/'))
});

gulp.task('wxml', () => {
  return gulp.src(['../src/**/*.wxml'])
      .pipe(gulp.dest('../dist/'))
});

gulp.task('json', () => {
  return gulp.src(['../src/**/*.json'])
      .pipe(gulp.dest('../dist/'))
});


gulp.task('default', ['wxss', 'js', 'wxml', 'json']);