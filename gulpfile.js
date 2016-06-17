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

// Require all needed task objects.
var gulp = require('gulp');

// Distribute
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minify = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

// Clean
var jslint = require('gulp-jslint');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// Path variables.
var jsFiles = [
  './app_client/**/*.js',
  '!./app_client/lib/**/*.js' // Exclude anything from lib.
];

var jsDistLocation = './app_client/lib';

var sassFiles = './public/stylesheets/sass/*.scss';
var cssCompileLocation = './public/stylesheets/css';
var cssDistLocation = './public/stylesheets';

gulp.task('lint', function () {
  return gulp.src(jsFiles)
    .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
    .pipe(jslint.reporter( 'default' )
    .pipe(jslint.reporter( 'stylish' )));
});

gulp.task('hint', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Concat, rename, and uglify all js files for our spa.
gulp.task('uglify-js', function(){
  return gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('dist.js'))
    .pipe(gulp.dest(jsDistLocation))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest(jsDistLocation));
});

// Combo of compile sass and minify css -- using pipe to guarantee compile finishes before minify starts.
gulp.task('distribute-sass', function(){
  return gulp.src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssCompileLocation))
    .pipe(concat('dist.css'))
    .pipe(gulp.dest(cssDistLocation))
    .pipe(minify({compatibility: 'ie8'}))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest(cssDistLocation));
});

// Watch project and redistribute when changes are made to scss or js files.
gulp.task('distribute-watch', function(){
  gulp.watch(sassFiles, ['distribute-sass']);
  gulp.watch(jsFiles, ['uglify-js']);
});

// Run all default tasks to build out dist.
gulp.task('default', [
  'hint',
  'uglify-js',
  'distribute-sass'
]);
