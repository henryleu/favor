define(['Underscore', 'jQuery'], function(_, $) {
    var JstLoader = function(options){
        _.extend(this, options);
    };
    _.extend( JstLoader.prototype, {
        mode: 'development',
        prefix: 'templates',
        JST: null,
        loadTemplates: function(templates, callback) {
            if(this.mode=='production'){
                var unloadedTemplates = [];
                for(var name in templates){
                    if(!this.JST[name]){
                        unloadedTemplates.push(name);
                    }
                    else{
                        templates[name] = this.JST[name];
                    }
                }
                if(unloadedTemplates.length>0){
                    console.error('These templates are not loaded: ' + unloadedTemplates.join(', '));
                }
                else{
                    callback();
                }
                return;
            }

            var names = _.keys(templates);
            var me = this;
            var loadTemplate = function(index) {
                var name = names[index];
                console.info('Loading view template: ' + name);
                $.get( me.prefix + '/' + name + '.html', function(data) {
                    templates[name] = _.template(data);
                    index++;
                    if (index < names.length) {
                        loadTemplate(index);
                    } else {
                        callback();
                    }
                });
            }
            loadTemplate(0);
        }
    });

    return JstLoader;
});