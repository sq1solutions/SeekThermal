module.exports = function(grunt) {
    // Begin grunt configuration
    grunt.initConfig({
    	pkg: grunt.file.readJSON('package.json'),

        // begin concat
        concat: {
        	options: {
        		seperator: ';'
        	},
        	dist: {
        		src: [
        		// Loads in the lib files
                    'app/js/dep/*.js', 
                    // loads in first as a Dep for popover.js
                    'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js', 
                    // Loads in the rest of the bootstrap files
                    'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/*.js', 
                    // Loads in Skrollr
                    'bower_components/skrollr/dist/skrollr.min.js',
                    // loads in the custom js
                    'app/js/main.js' // loads in the base script
                    ],
                dest: 'app/js/build/production.js' // Destination for the concat. files
              }
            },
            uglify: {
            	dist: {
            		files: {
            			'app/js/build/production.min.js' : ['app/js/build/production.js']
            		}
            	}
            },

            sass: {
            	dist: {
            		options: {
            			style: 'compressed'
            		},
            		files: {
            			'app/css/main.css': 'app/css/main.scss'
            		}
            	}
            },

            css: {
            	files: ['css/*.scss'],
            	tasks: ['sass'],
            	options: {
            		spawn: false,
            	}
            },

            watch: {
            	options: {
            		livereload: true,
            	},
            },
          });

    // Load in all the plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // register task
    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'watch']);
  }
