var crypto = require('crypto');
var fs = require('fs');

function createFileSha(filenane) {
	var sha = crypto.createHash('sha1');
	return sha.update(fs.readFileSync(filenane));
}

module.exports = function(grunt) {
	grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            components: {
                options: {
                    banner: '/*! all third-party libs including jquery, underscorejs, backbonejs and bootstrap */\n'
                },
                src: [
                    'public/components/jquery/jquery.js',
                    'public/components/jquery.cookie/jquery.cookie.js',
                    'public/components/underscore/underscore.js',
                    'public/components/backbone/backbone.js'
                ],
                dest: 'public/components/js/dependencies.js'
            },
            tl: {
                options: {
                    banner: '/*! tomato labs webapp mainjs */\n'
                },
                src: [
                    'public/tl/js/tomato-spa.js',
                    'public/tl/js/favor.js'
                ],
                dest: 'public/tl/js/main.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
            },
            main: {
                src: 'public/tl/js/main.js',
                dest: 'public/tl/js/main.min.js'
            },
            components: {
                src: 'public/components/js/dependencies.js',
                dest: 'public/components/js/dependencies.min.js'
            }
        }
	});

	// Laoded tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //grunt.loadNpmTasks('grunt-contrib-jshint');
	//grunt.loadNpmTasks('grunt-contrib-requirejs');
	//grunt.loadNpmTasks('grunt-hashres');

	// Default task.
	//grunt.registerTask('default', ['jshint', 'requirejs', 'hashres']);
    grunt.registerTask('default', ['concat', 'uglify']);

};
