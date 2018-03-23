const gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  newer = require('gulp-newer'),
  notify = require('gulp-notify'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync').create(),
  cleanCSS = require('gulp-clean-css'),
  del = require('del'),
  filter = require('gulp-filter');

const srcPath = 'source/'; // Path to our source files
const distPath = './docs/'; // The output files, hosted by GitHub

// Remove the derived folder
gulp.task('clean', function() {
  return del([distPath]);
})

// Minify images
gulp.task('imagemin', function() {
  const src = srcPath + '_/img/**/*';
  const dest = distPath + 'assets/img';
  return gulp.src(src)
    .pipe(imagemin())
    .pipe(gulp.dest(dest));
});

// Compile application sass
gulp.task('minifyapp', function() {
  const src = srcPath + '_/sass/**/*.scss';
  const dest = distPath + 'assets/css/';
  return gulp.src(src)
    .pipe(sass({
      'sourcemap=none': true,
      outputStyle: 'expanded'
    }))
    .pipe(concat('app.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dest));
});

// Copy vendor css
gulp.task('minifyvendor', function() {
  const src = 'node_modules/bulma/css/bulma.css';
  const dest = distPath + 'assets/css/';
  return gulp.src(src)
    .pipe(concat('vendor.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dest));
});

// Minify application javascript
gulp.task('uglifyapp', function() {
  const src = srcPath + '_/js/**/*.js';
  const dest = distPath + 'assets/js/';
  return gulp.src(src)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest));
});

// Minify vendor javascript
gulp.task('uglifyvendor', function() {
  const src = [
    'node_modules/highlightjs/highlight.pack.js',
    'node_modules/highlightjs-solidity/solidity.js',
  ]
  const dest = distPath + 'assets/js/';
  return gulp.src(src)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest));
});

// Copy everything except the special folder _
gulp.task('copyother', function() {
  const f = ['**', '!**/*/', '!**/_/**', '!**/_'];
  const f2 = function(vinyl) {
    return !vinyl.isDirectory()
  }
  return gulp.src(srcPath + '**/*')
    .pipe(filter(f))
    .pipe(filter(f2))
    .pipe(gulp.dest(distPath));
});

// Complete regenerate the dist folder
gulp.task('dist',
  gulp.series('clean',
    gulp.parallel(
      'imagemin',
      'minifyapp',
      'minifyvendor',
      'uglifyapp',
      'uglifyvendor',
      'copyother'
    )
  )
);

// Watch for changes
gulp.task('watch', function() {
  gulp.watch(srcPath + '_/img/**/*', gulp.task('imagemin'));
  gulp.watch(srcPath + '_/sass/**/*.scss', gulp.task('minifyapp'));
  gulp.watch(srcPath + 'node_modules/bulma/css/bulma.css', gulp.task('minifyvendor'));
  gulp.watch(srcPath + '_/js/**/*.js', gulp.task('uglifyapp'));
  gulp.watch('node_modules/**/*js', gulp.task('uglifyvendor'));
  gulp.watch(srcPath, gulp.task('copyother'));
});

// BrowserSync
gulp.task('serve', gulp.parallel('watch', function() {
  browserSync.init({
      server: distPath
  });
}));

// Tasks that run on 'gulp' command
gulp.task('default', gulp.task('serve'));
