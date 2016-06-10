/*
* Commands:
* gulp (default)
*       - uglify-js
*       - distribute-sass // combo of sass-compile and minify-css
*
* Additional commands:
* sass-watch
* sass-compile
* minify-css
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minify = require('gulp-clean-css');

// Concat, rename, and uglify all js files for our spa.
gulp.task('uglify-js', function(){
  return gulp.src([
    './app_client/app.js',
    './app_client/home/home.controller.js',
    './app_client/about/about.controller.js',
    './app_client/common/directives/navigationBar/navigationBar.directive.js',
    './app_client/common/directives/exampleDirective/example.directive.js'
  ])
    .pipe(concat('dist.js'))
    .pipe(gulp.dest('./app_client/lib'))
    .pipe(rename('dist.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app_client/lib'));
});

// Compile sass
gulp.task('sass-compile', function(){
  return gulp.src('./public/stylesheets/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets/css'));
});

// Concat, rename, and minify all css.
gulp.task('minify-css', function(){
  return gulp.src('./public/stylesheets/css/**/*.css')
    .pipe(concat('dist.css'))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(rename('dist.min.css'))
    .pipe(minify({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/stylesheets/'));
});

// Combo of compile and minify -- using pipe to guarantee compile finishes before minify starts.
gulp.task('distribute-sass', function(){
  return gulp.src('./public/stylesheets/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets/css'))
    .pipe(concat('dist.css'))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(rename('dist.min.css'))
    .pipe(minify({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/stylesheets/'));
});

// Watch sass files to compile when changed.
gulp.task('sass-watch', function(){
  gulp.watch('./public/stylesheets/sass/**/*.scss', ['sass']);
});

// Run all default tasks to build out dist.
gulp.task('default', [
  'uglify-js',
  'distribute-sass'
]);
