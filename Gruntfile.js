module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: { style: 'expanded', sourcemap: 'file' },
        files: [
          { expand: true, cwd: 'lib/scss/', src: ['*.scss'], dest: 'dist/css/', ext: '.css' }
        ]
      }
    },
    uglify: {
      dist: {
        files: [
          { expand: true, cwd: 'lib/js/', src: ['calendar.js', 'ccalendar.js'], dest: 'dist/js/', ext: '.js' }
        ]
      }
    },
    jade: {
      compile: {
        options: { data: { debug: false }, pretty: true },
        files: [
          { expand: true, cwd: 'lib/jade/front/', src: ['**/*.jade'], dest: 'dist/', ext: '.html' }
        ]
      }
    },
    copy: {
      main: {
        files: [
          { expand: true, cwd: 'lib/js/vendor/', src: ['**'], dest: 'dist/js/vendor' },
          { expand: true, cwd: 'lib/js/data/', src: ['events.json', 'config.css.json'], dest: 'dist/js/data' },
          { expand: true, cwd: 'lib/images/', src: ['**'], dest: 'dist/images' }
        ]
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'dist/css/*.css',
            'dist/*.html',
            'dist/js/data/*.json',
            'dist/js/**/*.js'
          ]
        },
        proxy: {
          proxyReq: [
            function (proxyReq) {
              console.log(proxyReq);
              proxyReq.setHeader('Content-Encoding', 'gzip');
            }
          ],
          proxyRes: [
              function (res, req, next) {
                  console.log(res.headers);
                  next();
              }
          ]
        },

        options: {
          watchTask: true,
          port: 8000,
          server: {
            baseDir: "./dist"
          }
        },
        middleware: [
            function (req, res, next) {
                console.log(1111);
            },
            function (req, res, next) {
                console.log(2222);
            }
        ]
      }
    },
    cssmin: {
      options: {
        report: 'gzip'
      },
      target: {
        files: [{ expand: true, cwd: 'dist/css', src: ['*.css'], dest: 'dist/css', ext: '.min.css' }]
      }
    },
    watch: {
      sass: {
        files: [
          'lib/scss/**/*.scss'
        ],
        tasks: ['sass']
      },
      js: {
        files: [
          'lib/js/**/*.js'
        ],
        tasks: ['uglify']
      },
      lib: {
        files: [
          'lib/js/vendor/**/*.js', 'lib/js/**/*.json', 'lib/images/**/*.*'
        ],
        tasks: ['copy']
      },
      jade: {
        files: [
          'lib/jade/**/*.jade',
        ],
        tasks: ['jade:compile']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['browserSync', 'watch']);

};
