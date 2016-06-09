const gulp = require('gulp'),
  uglify = require('gulp-uglify'),                    // js 壓成一行    
  sourcemaps = require('gulp-sourcemaps'),            // sourcemap
  gulpPlumber = require('gulp-plumber'),              // catch Error 用    
  jeditor = require("gulp-json-editor"),              // json editor
  rename = require("gulp-rename"),                    // 更名
  //imagemin = require('gulp-imagemin');
  imageminPngquant = require('imagemin-pngquant'),    // 壓K png 
  imageminMozgjpeg = require('imagemin-mozjpeg'),     // 壓K jpg
  fs = require('fs'),                                 // 檔案寫入，讀取
  colors = require('colors'),                         // console 換顏色
  base64 = require('gulp-base64'),                    // 圖片轉 base64 字串
  sass = require('gulp-sass'),                        // sass
  htmlmin = require('gulp-htmlmin'),                  // html 壓成一行
  cache = require('gulp-cache'),                      //
  autoprefixer = require('gulp-autoprefixer'),        // css autoprefixer
  concat = require('gulp-concat');                    // 合拼多個 js
var browserSync = require('browser-sync').create();   // browserSync

// 記錄啟動時間
var startTime = Date.now();

function watch_change_handler( event ){    
  console.log(event.path , event.type);
  if ( event.type != 'deleted') {
      browserSync.reload();    
  }    
}
function date_now_format(){    
  var date = new Date();
  return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
}
function dev_time_format( pTime ){    
  var sec = pTime / 1000 | 0;
  var min = sec / 60 | 0;
  var hour = min / 60 | 0;
  return hour +"h " + (min%60) +"m " + (sec%60) +"s";
}
function taskLog( pTask ){    
  console.log( ('---------------------------------------------' + pTask ).yellow );
}

/*
██     ██ ████████  ████████     ███    ████████ ████████         ████████ ████ ██     ██ ████████ 
██     ██ ██     ██ ██     ██   ██ ██      ██    ██                  ██     ██  ███   ███ ██       
██     ██ ██     ██ ██     ██  ██   ██     ██    ██                  ██     ██  ████ ████ ██       
██     ██ ████████  ██     ██ ██     ██    ██    ██████              ██     ██  ██ ███ ██ ██████   
██     ██ ██        ██     ██ █████████    ██    ██                  ██     ██  ██     ██ ██       
██     ██ ██        ██     ██ ██     ██    ██    ██                  ██     ██  ██     ██ ██       
███████  ██        ████████  ██     ██    ██    ████████ ███████    ██    ████ ██     ██ ████████ 
*/
gulp.task('update_time', function() {
  taskLog('update_time');
  var stopTime = new Date().getTime();
  var elapTime = stopTime - startTime;
  startTime = stopTime;
  return gulp.src('./config.json')
      .pipe( jeditor(function (json){    
          if ( !json.startTime || json.startTime == '') {
              json.startTime = date_now_format();
          }            
          json._devTime += elapTime;
          json.devTime = dev_time_format( json._devTime );
          return json;
      }))
      .pipe( gulp.dest("./") );
});

/*
████ ██    ██ ████ ████████ 
██  ███   ██  ██     ██    
██  ████  ██  ██     ██    
██  ██ ██ ██  ██     ██    
██  ██  ████  ██     ██    
██  ██   ███  ██     ██    
████ ██    ██ ████    ██    
*/
gulp.task('init', function() {    
  taskLog('init');         
  fs.exists('./config.json',function ( exists ){    
      if ( !exists) {
          var config = {
              _devTime  :0,
              startTime :date_now_format()                
          }
          fs.writeFile('config.json', JSON.stringify(config), function(err) {
              if (err) 
                  throw err;
              console.log('It\'s saved!');
          });
      }
  })
});

/*
   ██╗███████╗
   ██║██╔════╝
   ██║███████╗
██   ██║╚════██║
╚█████╔╝███████║
╚════╝ ╚══════╝ 
*/

var jsfiles_conf = [
  {
      'base_dir' : './src/js/lib/',
      'files' : [
          'jquery-1.12.1.min.js',
          'bootstrap.min.js',
          'metisMenu.min.js',
          'sb-admin-2.js',
          'jquery.tooltipster.min.js',
          'sweetalert.min.js',
          'pagealert.js'
      ],
      'dist_dir' : './public/js/',
      'output_file' : 'common.js'
  },
  {
      'base_dir' : './src/js/lib/',
      'files' : [
          'validator.js',
          'validator_ext.js'
      ],
      'dist_dir' : './public/js/',
      'output_file' : 'validators.js'
  },
  {
      'base_dir' : './src/js/lib/',
      'files' : [
          'socket.io.js'
      ],
      'dist_dir' : './public/js/',
      'output_file' : 'sockets.js'
  }
];
gulp.task('js', function() {
  taskLog('js');  
  var tasks = jsfiles_conf.map(function(ut) {
      var _files = [];
      for (var i = 0;i < ut.files.length; i++) {
          var _f = ut.base_dir + ut.files[i];
          _files.push(_f);
      }
      gulp.src(_files)
          .pipe(gulpPlumber())
          .pipe(concat(ut.output_file))
          .pipe(sourcemaps.init())
          .pipe(uglify())
          .pipe(gulp.dest(ut.dist_dir))
          .pipe(sourcemaps.write('./maps/js/'))
          .pipe(gulp.dest(ut.dist_dir));
          //.pipe( browserSync.stream() );
  });
  gulp.src(['./src/**/*.js', '!./src/js/lib/**'])
      .pipe(gulpPlumber())
      .pipe(sourcemaps.init())
      .pipe(gulp.dest('./public/'))
      .pipe(uglify())
      .pipe(sourcemaps.write('./js/maps'))
      .pipe(gulp.dest(function(file) {
          /*for (var itm in file) {
              console.log(itm);
              console.log(file[itm]);
          }*/
          return file.base;
      }));
});
/*
██████╗███████╗███████╗
██╔════╝██╔════╝██╔════╝
██║     ███████╗███████╗
██║     ╚════██║╚════██║
╚██████╗███████║███████║
╚═════╝╚══════╝╚══════╝
*/
var cssfiles_conf = [
  {
      'base_dir' : './src/css/lib/',
      'files' : [
          'bootstrap.min.css',
          'font-awesome.min.css',
          'metisMenu.min.css',
          'sb-admin-2.css',
          'sweetalert.css',
          'tooltipster.css',
          'themes/tooltipster-shadow.css'
      ],
      'dist_dir' : './public/css/',
      'output_file' : 'common.css'
  }
];
gulp.task('css', function() {
  taskLog('css');  
  var tasks = cssfiles_conf.map(function(ut) {
      var _files = [];
      for (var i = 0;i < ut.files.length; i++) {
          var _f = ut.base_dir + ut.files[i];
          _files.push(_f);
      }
      gulp.src(_files)
          .pipe(gulpPlumber())
          .pipe(concat(ut.output_file))
          .pipe(gulp.dest(ut.dist_dir))
          //.pipe( browserSync.stream() );
  });
  gulp.src('./src/css/lib/*.map')
      .pipe(gulp.dest('./public/css/'));
  gulp.src(['./src/**/*.css', '!./src/css/lib/**'])
      .pipe(gulpPlumber())
      .pipe(gulp.dest('./public/'));
});

/*
██████   ██████   ██████  
██    ██ ██    ██ ██    ██ 
██       ██       ██       
██        ██████   ██████  
██             ██       ██ 
██    ██ ██    ██ ██    ██ 
██████   ██████   ██████  
*/
gulp.task('scss', function() {
  taskLog('scss');
  return gulp.src( 'src/scss/**.scss' )    
      .pipe( gulpPlumber() )  
      .pipe( sourcemaps.init() )        
      .pipe(
          sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))        
      .pipe( autoprefixer({
          browsers: ['last 2 versions']
          // cascade: false
      } ))
      .pipe( base64() )
      .pipe( rename({  suffix: '.min' }) )
      .pipe( sourcemaps.write( '.') ) 
      .pipe( gulp.dest('dist/css') )
      .pipe( browserSync.stream( {match: '**/*.css'} )); 
});

/*
██████╗██╗  ██╗███████╗██████╗ ██╗████████╗ ██████╗ ██████╗ 
██╔════╝██║ ██╔╝██╔════╝██╔══██╗██║╚══██╔══╝██╔═══██╗██╔══██╗
██║     █████╔╝ █████╗  ██║  ██║██║   ██║   ██║   ██║██████╔╝
██║     ██╔═██╗ ██╔══╝  ██║  ██║██║   ██║   ██║   ██║██╔══██╗
╚██████╗██║  ██╗███████╗██████╔╝██║   ██║   ╚██████╔╝██║  ██║
╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
*/
gulp.task('ckeditor', function() {
  taskLog('ckeditor');
  return gulp.src( './src/js/ckeditor/**')
      .pipe( gulpPlumber() )
      .pipe(gulp.dest( './public/js/ckeditor' ));
});
/*
██     ██ ████████ ██     ██ ██       
██     ██    ██    ███   ███ ██       
██     ██    ██    ████ ████ ██       
█████████    ██    ██ ███ ██ ██       
██     ██    ██    ██     ██ ██       
██     ██    ██    ██     ██ ██       
██     ██    ██    ██     ██ ████████ 
*/
gulp.task('html', function() {
  taskLog('html');
  return gulp.src('src/*.+(html|handlebar)')
      .pipe( gulpPlumber() )       
      .pipe( htmlmin({collapseWhitespace: true}) )
      .pipe( gulp.dest('dist') )
      .pipe( browserSync.stream() );
});

/*
████ ██     ██    ███     ██████   ████████ 
██  ███   ███   ██ ██   ██    ██  ██       
██  ████ ████  ██   ██  ██        ██       
██  ██ ███ ██ ██     ██ ██   ████ ██████   
██  ██     ██ █████████ ██    ██  ██       
██  ██     ██ ██     ██ ██    ██  ██       
████ ██     ██ ██     ██  ██████   ████████ 
*/
gulp.task( 'minijpg', function() {
  taskLog('minijpg');
  return gulp.src( 'src/img/**/*.jpg' )
      .pipe( cache( imageminMozgjpeg({quality:80})() ) )
      .pipe( gulp.dest('./img') );
});
gulp.task( 'minipng', function() {
  taskLog('minipng');
  return gulp.src('src/img/**/*.png')
      .pipe( cache( imageminPngquant({quality:'65-80',speed:4})() ) )
      .pipe( gulp.dest('./img') );
});
gulp.task( 'copy_other_images', function() {
  taskLog('copy_other_images');
  return gulp.src( ['src/img/**/','!./src/img/**/*.jpg', '!./src/img/**/*.png'])
      .pipe(gulp.dest('./img'));
});

// https://www.browsersync.io/docs/options/
/*
██      ██ ████████ ████████   ██████  ████████ ████████  ██     ██ ████████ ████████  
██  ██  ██ ██       ██     ██ ██    ██ ██       ██     ██ ██     ██ ██       ██     ██ 
██  ██  ██ ██       ██     ██ ██       ██       ██     ██ ██     ██ ██       ██     ██ 
██  ██  ██ ██████   ████████   ██████  ██████   ████████  ██     ██ ██████   ████████  
██  ██  ██ ██       ██     ██       ██ ██       ██   ██    ██   ██  ██       ██   ██   
██  ██  ██ ██       ██     ██ ██    ██ ██       ██    ██    ██ ██   ██       ██    ██  
███  ███  ████████ ████████   ██████  ████████ ██     ██    ███    ████████ ██     ██ 
*/
gulp.task('browserSync', function() {
  taskLog('browserSync');
  browserSync.init({
      // files           : "dist/css/**/*.css",
      // injectChanges   : true,        
      // ghostMode       : true,
      server: {
          baseDir     : "./dist"
      }
      // proxy: "toyota.localhost.com"
  });    
});




/*
██      ██    ███    ████████  ██████  ██     ██ 
██  ██  ██   ██ ██      ██    ██    ██ ██     ██ 
██  ██  ██  ██   ██     ██    ██       ██     ██ 
██  ██  ██ ██     ██    ██    ██       █████████ 
██  ██  ██ █████████    ██    ██       ██     ██ 
██  ██  ██ ██     ██    ██    ██    ██ ██     ██ 
███  ███  ██     ██    ██     ██████  ██     ██ 
*/
gulp.task('watch', function() {    
  taskLog('watch');
  gulp.watch( ['src/html/**/*.+(html|nunjucks)'], ['html','update_time']);
  gulp.watch( ['src/js/**/*.js'], ['js','update_time']);
  gulp.watch( ['src/img/**/*.jpg'], ['minijpg','update_time']).on('change',watch_change_handler);
  gulp.watch( ['src/img/**/*.png'], ['minipng','update_time']).on('change',watch_change_handler);
  gulp.watch( ['src/img/**/*'], ['copy_other_images','update_time']).on('change',watch_change_handler);
  gulp.watch( ['src/scss/*.scss'], ['scss','update_time'] );
});



/*
████████  ████████ ████████    ███    ██     ██ ██       ████████ 
██     ██ ██       ██         ██ ██   ██     ██ ██          ██    
██     ██ ██       ██        ██   ██  ██     ██ ██          ██    
██     ██ ██████   ██████   ██     ██ ██     ██ ██          ██    
██     ██ ██       ██       █████████ ██     ██ ██          ██    
██     ██ ██       ██       ██     ██ ██     ██ ██          ██    
████████  ████████ ██       ██     ██  ███████  ████████    ██    
*/
//gulp.task('default',['init','scss','js','html','minijpg','minipng','copy_other_images','watch','webserver']);

gulp.task('default', [
      /*'init',
      'scss',
      'js',
      'minijpg',
      'minipng',
      'copy_other_images'
      'html',
      'watch',
      'browserSync'*/
      'js',
      'css',
      'minijpg',
      'minipng',
      'copy_other_images'
  ]);