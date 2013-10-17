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
            img: {
                files: [
                    {
                        expand: true, flatten: false,
                        cwd: 'web/css/img/',
                        src: ['**'],
                        dest: 'public/build/img/'
                    },
                    {
                        expand: true, flatten: false,
                        cwd: 'web/css/img/',
                        src: ['**'],
                        dest: 'web/build/img/'
                    }
                ]
            }
        },
        jst: {
            compile: {
                options: {
                    processName: function(filename) {
                        return filename.substring('web/template/'.length, filename.indexOf('.html'));
                    },
                    templateSettings: {
                        interpolate : /<%=([\s\S]+?)%>/g
                    }
                },
                files: {
                    "public/build/js/templates.js": ["web/template/*.html"]
                }
            }
        },
        sprite: {
            all: {
                // List of images to add to sprite
                'src': [ 'web/img/*.png' ],
                // Address of target image
                'destImg': 'public/build/img/sprite.png',
                'destCSS':  'web/css/sprite.less',
                'imgPath': '../sprite.png',
                // OPTIONAL: Image placing algorithm: top-down, left-right, diagonal, alt-diagonal
                'algorithm': 'alt-diagonal',
                // OPTIONAL: Specify padding between images
                'padding': 2,
                // OPTIONAL: Rendering engine: auto, canvas, gm
                'engine': 'gm',
                // OPTIONAL: Specify CSS format (inferred from destCSS' extension by default)
                // (stylus, scss, sass, less, json, css)
                'cssFormat': 'json',
                // OPTIONAL: Preferences for resulting image
                'exportOpts': {
                    'imagemagick': true,
                    // Image formst (buy default will try to use dest extension)
                    'format': 'png',
                    // Quality of image (gm only)
                    'quality': 90
                },
                // OPTIONAL: Specify img options
                'imgOpts': {
                    // Format of the image (inferred from destImg' extension by default) (jpg, png)
                    'format': 'png',

                    // Quality of image (gm only)
                    'quality': 90
                },
                // OPTIONAL: Specify css options
                'cssOpts': {
                    // Some templates allow for skipping of function declarations
                    'functions': false
                }
            }
        },
        requirejs: {
            js: {
                options: {
                    baseUrl: "web/js",
                    mainConfigFile: "web/js/main.js",
                    include: ['requireLib'],
                    name: 'main',
                    out: "public/build/main.js"
                }
            },
            css_prd: {
                options: {
                    baseUrl: 'web/css',
                    cssIn: "web/css/main.css",
                    out: "public/build/main.css",
                    cssImportIgnore: null,
                    optimizeCss: 'default'
                }
            },
            css_dev: {
                options: {
                    baseUrl: 'web/css',
                    cssIn: "web/css/main.css",
                    out: "web/build/main.css",
                    cssImportIgnore: null,
                    optimizeCss: 'standard.keepComments.keepLines'
                }
            }
        },
        watch: {
            img: {
                files: ['web/css/img/*'],
                tasks: ['copy:img', 'requirejs:css_prd', 'requirejs:css_dev'],
                options: {
                    nospawn: true,
                    interrupt: false
                }
            },
            css: {
                files: ['web/css/*.css'],
                tasks: ['requirejs:css_prd', 'requirejs:css_dev'],
                options: {
                    nospawn: true,
                    interrupt: false
                }
            },
            template: {
                files: ['web/template/*.html'],
                tasks: ['jst'],
                options: {
                    nospawn: true,
                    interrupt: false
                }
            },
            js: {
                files: ['web/js/*.js', 'web/js/*/*.js'],
                tasks: ['requirejs:js'],
                options: {
                    nospawn: true,
                    interrupt: false
                }
            }
        }
	});

	// Laoded tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
//    grunt.loadNpmTasks('grunt-contrib-concat');
//    grunt.loadNpmTasks('grunt-contrib-uglify');
//    grunt.loadNpmTasks('grunt-recess');
//	  grunt.loadNpmTasks('grunt-hashres');
//    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');


	// Default task.
	//grunt.registerTask('default', ['jshint', 'requirejs', 'hashres']);
//    grunt.registerTask('default', ['copy',  'jst', 'concat', 'recess','uglify']);
    grunt.registerTask('default', ['copy', 'jst', 'requirejs']);
    grunt.registerTask('dev', ['watch']);
};
