const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const runSequence = require('run-sequence');

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('sass', function() {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
  return gulp
    .src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images
gulp.task('images', function() {
  return gulp
    .src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(
      cache(
        imagemin({
          interlaced: true
        })
      )
    )
    .pipe(gulp.dest('dist/images'));
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
});

// Cleaning
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('cache:clear', function(callback) {
  return cache.clearAll(callback);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch', callback);
});

gulp.task('build', function(callback) {
  runSequence('clean:dist', 'sass', ['useref', 'images', 'fonts'], callback);
});
