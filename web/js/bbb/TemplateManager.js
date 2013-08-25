define([], function() {
    var TemplateManager = function(jst){
        this.templates = {};
        _.extend(this.templates, jst);
    };
    _.extend( TemplateManager.prototype, {
        templates: {},

        // Get template by name from hash of preloaded templates
        get: function(name) {
            if(!this.templates[name]){
                console.error('js template \"'+ name + '\" does not exist' );
                return function(){alert('no '+name + ' template');};
            }
            return this.templates[name];
        }
    });

    return TemplateManager;
});