module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '0.0.0.0',
          keepalive: true
        }
      }
    },

    copy: {
      default: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: '**',
            dest: 'dist/'
          },
        ]
      }
    },

    watch: {
      scripts: {
        files: 'app/js/**/*.js'
      }
    },

    concurrent: {
      default: {
        tasks: [
          'connect:server',
          'watch'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'app/css/main.min.css': ['app/css/*.css']
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['app/**/*.js'],
        dest: 'app/js/built.js',
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent')

  // Default task(s).
  grunt.registerTask('default', ['cssmin', 'concurrent']);
  grunt.registerTask('build:dist', [
    'copy'
  ]);
};