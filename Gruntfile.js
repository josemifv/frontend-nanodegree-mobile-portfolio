/* jshint node:true */

var ngrok = require('ngrok');
//var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    clean: {
      dist: "dist"
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**'],
            dest: 'dist'
          }
        ]
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          "console": true,
          "jQuery": true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      dist: {
        src: ['src/js/*.js', 'src/views/js/*.js']
      }
    },
    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'dist'
        }]
      }
    },
    imagemin: {
      dist: {
        options: {
          cache: false
          // optimizationLevel: 3,
          // svgoPlugins: [{ removeViewBox: false }],
          // use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },  
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.css'],
          dest: 'dist/'
        }]        
      }
    },
    connect: {
      server: {
        options: {
          port: 9292,
          base: 'dist/'
        }
      }
    },
    pagespeed: {
      options: {
        nokey: true,
        locale: "en_GB",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    }
  });

  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 9292;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');  
  grunt.loadNpmTasks('grunt-contrib-imagemin');  
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ['clean', 'copy', 'jshint', 'uglify', 'cssmin', 'imagemin', 'connect', 'psi-ngrok']);
};
