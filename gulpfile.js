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
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minify = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

// Path variables.
var jsFiles = [
  './app_client/app.js',
  './app_client/home/home.controller.js',
  './app_client/about/about.controller.js',
  './app_client/common/directives/navigationBar/navigationBar.directive.js',
  './app_client/common/directives/exampleDirective/example.directive.js'
];

var jsDistLocation = './app_client/lib';

var sassFiles = './public/stylesheets/sass/*.scss';
var cssCompileLocation = './public/stylesheets/css';
var cssDistLocation = './public/stylesheets';

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

// Compile sass
//gulp.task('sass-compile', function(){
//  return gulp.src('./public/stylesheets/sass/*.scss')
//    .pipe(sass().on('error', sass.logError))
//    .pipe(gulp.dest('./public/stylesheets/css'));
//});

// Concat, rename, and minify all css.
//gulp.task('minify-css', function(){
//  return gulp.src('./public/stylesheets/css/**/*.css')
//    .pipe(concat('dist.css'))
//    .pipe(gulp.dest('./public/stylesheets'))
//    .pipe(rename('dist.min.css'))
//    .pipe(minify({compatibility: 'ie8'}))
//    .pipe(gulp.dest('./public/stylesheets/'));
//});


// Combo of compile and minify -- using pipe to guarantee compile finishes before minify starts.
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

// Watch sass files to compile when changed.
//gulp.task('sass-watch', function(){
//  gulp.watch('./public/stylesheets/sass/**/*.scss', ['sass']);
//});

// Watch project and redistribute when changes are made to scss or js files.
gulp.task('distribute-watch', function(){
  gulp.watch(sassFiles, ['distribute-sass']);
  gulp.watch(jsFiles, ['uglify-js']);
});

// Run all default tasks to build out dist.
gulp.task('default', [
  'uglify-js',
  'distribute-sass'
]);
