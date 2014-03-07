module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: 'tmp/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/*.js'],
        dest: 'tmp/<%= pkg.name %>.js'
      }
    },

    imagemin: {
      static: {
        options: {
          optimizationLevel: 7
        },
        files: {
          'dist/urba-pc.png': 'img/urba-pc.png'
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'dist/main.min.css': ['css/*.css']
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('imagemin', ['imagemin']);
  grunt.registerTask('build', ['concat', 'uglify', 'cssmin']);

};