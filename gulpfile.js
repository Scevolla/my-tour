
var gulp          = require('gulp');
var sass          = require('gulp-sass');
var plumber       = require('gulp-plumber');
var postcss       = require('gulp-postcss');
var autoprefixer  = require('autoprefixer');
var mqpacker      = require('css-mqpacker');
var minifycss     = require('gulp-csso');
var rename        = require('gulp-rename');
var server        = require('browser-sync');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var run           = require('run-sequence');

var projectname = '';
var cssproc = 'scss';
var paths = {
  root:  '/' + projectname,
  build: projectname + 'build',
  html:  projectname,
  sass:  projectname + 'sass',
  css:   projectname + 'css',
  js:    projectname + 'js',
  img:   projectname + 'img',
  fonts: projectname + 'fonts'
};

gulp.task("style", function() {
  return gulp.src(paths.sass + "/**/*." + cssproc)
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    autoprefixer({ browsers: [
      "last 10 version",
      "last 5 Chrome versions",
      "last 5 Firefox versions",
      "last 5 Opera versions",
      "last 5 Edge versions"
    ]}),
    mqpacker({
      sort: true
    })
  ]))
  .pipe(gulp.dest(paths.css))
  .pipe(minifycss())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(paths.css));
});

gulp.task('scripts', function(){
  return gulp.src(paths.js + '/**/*.js')
  .pipe(concat('scripts.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.js));
});

gulp.task("browser-sync", function() {
  server.init({
    server: "."
  });
});

gulp.task("watch", function() {  
  gulp.watch("sass/**/*." + cssproc, ["style"]);
  gulp.watch('css/**/*.css').on("change", server.reload);
  gulp.watch('*.html').on("change", server.reload);
  gulp.watch('js/**/*.js').on("change", server.reload);
});

gulp.task('default', function(fn) {
  run(
    "style", 
    "browser-sync", 
    "watch", 
    fn);
});