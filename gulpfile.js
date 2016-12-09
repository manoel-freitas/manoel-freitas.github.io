const gulp        = require('gulp');
const concat      = require('gulp-concat');
const browserSync = require('browser-sync');
const plumber     = require('gulp-plumber');
const cp          = require('child_process');
const changed     = require('gulp-changed');
const stylus      = require('gulp-stylus');
const rupture     = require('rupture');
const prefixer    = require('autoprefixer-stylus');
const nib         = require('nib');
const imagemin    = require('gulp-imagemin');
const ghPages     = require('gulp-gh-pages');

let messages = {
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', done => {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--drafts', '--quiet', '--config', '_config.yml,_config_dev.yml'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], () => {
  browserSync.reload();
});

gulp.task('browserSync', ['jekyll-build'], () => {
  browserSync({
    server: { baseDir: "_site/" },
    open: false
  });
});

gulp.task('styles', () => {
  return gulp.src('src/styles/main.styl')
    .pipe(changed('assets/styles'))
    .pipe(plumber())
    .pipe(stylus({
      use:[prefixer(), rupture(), nib()],
	    compress: false
    }))
    .pipe(gulp.dest('_site/assets/styles'))
    .pipe(gulp.dest('_includes'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('assets/styles'));
});

gulp.task('imagemin', tmp => {
  return gulp.src('assets/images/**/*.{jpg,png,gif}')
    .pipe(changed('assets/images'))
    .pipe(plumber())
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('assets/images'));
});

gulp.task('watch', ()  => {
  gulp.watch('src/styles/**/*', ['styles']);
  gulp.watch('src/images/**/*.{jpg,png,gif}', ['imagemin']);
  gulp.watch(['_drafts/*', '_includes/*', '_layouts/*', '_posts/*', '*.{html,md}', '_config.yml'], ['jekyll-rebuild']);
});

gulp.task('deploy', function() {
  return gulp.src(['./**/*',' !_site/'])
    .pipe(ghPages({
        branch:'master'
    }));
});

gulp.task('default', ['styles', 'imagemin', 'browserSync', 'watch']);
