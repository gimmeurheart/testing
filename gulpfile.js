let gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    twig = require('gulp-twig'),
    imagemin = require('gulp-imagemin');


gulp.task('clean', function(){
    del.sync('dist')
})

gulp.task('scss', function(){
   return gulp.src('app/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
       overrideBrowserslist: ['last 8 versions']
   }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function(){
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
    ])
    .pipe(plumber())
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function(){
   return gulp.src('app/*.html')
    .pipe(plumber())
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function(){
   return gulp.src('app/js/*.js')
    .pipe(plumber())
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function(){
    return gulp.src([
        'node_modules/slick-carousel/slick/slick.js',
    ])
    .pipe(plumber())
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

gulp.task('build', async function(){
   let buildHtml = gulp.src(['app/**/*.twig', 'app/**/*.html'])
   .pipe(twig())
   .pipe(gulp.dest('dist'));

    let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

    let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));

    let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

});


gulp.task('build', async function(cb){
    let BuildImg = gulp.src('app/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));

    cb();

});

gulp.task('watch', function(){
   gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
    gulp.watch(['app/*.twig','app/*.html'], gulp.parallel('html'))
    gulp.watch('app/js/*.js', gulp.parallel('script'))
});



gulp.task('default', gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch'));
