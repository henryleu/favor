var crypto = require('crypto');
var fs = require('fs');

function createFileSha(filenane) {
	var sha = crypto.createHash('sha1');
	return sha.update(fs.readFileSync(filenane));
}

module.exports = function(grunt) {
	grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            components: {
                files: [
                    {
                        expand: true, flatten: false,
                        cwd: 'public/components/bootstrap-tl/tl-bootstrap/img/',
                        src: ['**'],
                        dest: 'public/components/tl/img/'
                    },
                    {
                        expand: true, flatten: false, filter: 'isFile',
                        cwd: 'public/components/font-awesome/font/',
                        src: ['**'],
                        dest: 'public/components/tl/font/'
                    }
                ]
            }
        },
        concat: {
            components_css: {
                options: {
                    banner: '/*! all third-party style-sheets including bootstrap and font-awesome/\n'
                },
                src: [
                    'public/components/bootstrap-tl/tl-bootstrap/css/tl-bootstrap.css',
                    'public/components/bootstrap-tl/tl-bootstrap/css/tl-bootstrap-responsive.css',
                    'public/components/font-awesome/css/font-awesome.css'
                ],
                dest: 'public/components/tl/css/dependencies.css'
            },

            components_js: {
                options: {
                    banner: '/*! all third-party scripts including jquery, underscore, backbone and bootstrap */\n'
                },
                src: [
                    'public/components/jquery/jquery.js',
                    'public/components/jquery.cookie/jquery.cookie.js',
                    'public/components/underscore/underscore.js',
                    'public/components/backbone/backbone.js',
                    'public/components/bootstrap-tl/tl-bootstrap/js/tl-bootstrap.js'
                ],
                dest: 'public/components/tl/js/dependencies.js'
            },
            tl_css: {
                options: {
                    banner: '/*! Tomato Labs webapp main css */\n'
                },
                src: [
                    'public/tl/css/favor.css'
                ],
                dest: 'public/tl/css/main.css'
            },
            tl_js: {
                options: {
                    banner: '/*! Tomato Labs webapp main js */\n'
                },
                src: [
                    'public/tl/js/tomato-spa.js',
                    'public/tl/js/favor.js'
                ],
                dest: 'public/tl/js/main.js'
            }
        },
        recess: {
            dist: {
                options: {
                    compress: true
                },
                files: [
                    {'public/components/tl/css/dependencies.min.css': ['public/components/tl/css/dependencies.css']},
                    {'public/tl/css/main.min.css': ['public/tl/css/main.css']}
                ]
            }
        },
        jst: {
            compile: {
                options: {
                    processName: function(filename) {
                        return filename.substring('templates/'.length, filename.indexOf('.htm'));
                    },
                    templateSettings: {
                        interpolate : /<%=([\s\S]+?)%>/g
                    }
                },
                files: {
                    "public/tl/js/templates.js": ["templates/*.html"]
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
            },
            components: {
                src: 'public/components/tl/js/dependencies.js',
                dest: 'public/components/tl/js/dependencies.min.js'
            },
            templates: {
                src: 'public/tl/js/templates.js',
                dest: 'public/tl/js/templates.min.js'
            },
            main: {
                src: 'public/tl/js/main.js',
                dest: 'public/tl/js/main.min.js'
            }
        }
	});

	// Laoded tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-recess');

    //grunt.loadNpmTasks('grunt-contrib-jshint');
	//grunt.loadNpmTasks('grunt-contrib-requirejs');
	//grunt.loadNpmTasks('grunt-hashres');

	// Default task.
	//grunt.registerTask('default', ['jshint', 'requirejs', 'hashres']);
    grunt.registerTask('default', ['copy', 'concat', 'recess', 'jst', 'uglify']);
};
