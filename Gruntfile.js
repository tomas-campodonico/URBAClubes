module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '0.0.0.0',
          keepalive: true,
          base: 'app'
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent')

  // Default task(s).
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('build:dist', [
    'copy'
  ]);
};