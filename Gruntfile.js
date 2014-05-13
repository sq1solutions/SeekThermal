module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json');
		connect: {
			server: {
				options: {},
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'css/main.css': 'css/main.scss'
				}
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			css: {
				files: ['css/*.scss'],
				tasks: ['sass'],
				option: {
					spawn: false,
				}
			},
		}
	});
	 // Load in all the plugins
    grunt.loadNomTasks('grunt-contrib-concat');
    grunt.loadNomTasks('grunt-contrib-uglify');
    grunt.loadNomTasks('grunt-contrib-connect');
    grunt.loadNomTasks('grunt-contrib-watch');

    // register task
    grunt.registerTask('default', ['concat']);
}