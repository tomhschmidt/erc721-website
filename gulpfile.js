// include gulp
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create();

// image processing
gulp.task('imagemin', function() {
   var img_src = 'source/_/img/**/*', img_dest = 'source/assets/img';

   gulp.src(img_src)
   .pipe(imagemin())
   .pipe(gulp.dest(img_dest));
});

// minify scripts
gulp.task('compress', function() {
  return gulp.src('source/_/js/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('source/assets/js/'));
});

// minify & concatenate vendor scripts
gulp.task('vendor', function() {
  return gulp.src([
    'source/_/js/vendor/*.js',
    'node_modules/highlightjs/highlight.pack.js',
    'node_modules/highlightjs-solidity/solidity.js',
  ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('source/assets/js/'));
});

// compile sass and concatenate
gulp.task('style', function() {
  return gulp.src([
    'source/_/sass/*.scss',
    'node_modules/highlightjs/styles/default.css',
  ])
    .pipe(sass({
      'sourcemap=none': true,
      outputStyle: 'expanded'
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('source/assets/css/'))
    .pipe(notify({ message: 'Style task complete!' }));
});

// Browsersync
gulp.task('browser-sync', function() {
  browserSync.init(["source/**", "source/assets/css/*.css", "source/assets/js/*.js"], {
    server: {
      baseDir: "source"
    }
  });
});

// watch these directories/files for changes
gulp.task('watch', ['browser-sync'], function() {
  // watch changes to all image, js & sass files within `_/` directory
  gulp.watch('source/_/img/*', ['imagemin']),
  gulp.watch('source/_/js/**/*.js', ['compress']),
  gulp.watch('source/_/js/vendor/**/*.js', ['vendor']),
  gulp.watch('source/_/sass/**/*.scss', ['style'])
});

// tasks that run on 'gulp' command
gulp.task('default', ['watch']);
gulp.task('prod', function() {
  gulp.src('source/index.html')
  .pipe(gulp.dest('./'))

  gulp.src('source/assets/**/*')
  .pipe(gulp.dest('./assets'))
})
