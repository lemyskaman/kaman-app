var Promise = require('bluebird')
var radio = require('backbone.radio')
var Mn = require('backbone.marionette');
var kamanCore = require('kaman-core');
var KamanUi = require('kaman-ui');


var kamanFunctions = kamanCore.Functions

//var interface=require('kaman-ui')




var Kapp = Mn.Application.extend({

    channelName: 'kaman:app',
    region: '#root',

    ui: {},
    radioEvents:{
        'notify':'notify'
        
    },
    radioRequests: {
        'module:show': 'moduleShow',
        'modules':function(){return this.modules}

    },
    notify:function(message,type){
        switch (type) {
            case "warning":  
                console.warn(message)

                break;
            case "danger":
                console.error(message)
                break;
            default:
                console.info(message)
                break;
        }
    },

    moduleShow: function (name) {
    
        //console.log(new _.findWhere(this.modules,{name:data.get('name')}).MainView())
        //with underscore first we search for a module with the proper name and then
        // we get its view constructor and build a view and pass a parameter 
        //this.region.showChildView('|page',new _.findWhere(this.modules,{name:data.get('name')}).MainView())

        console.log("name: "+name)


        //we get the view constructor from the passed module array using the name from the data of  the clicked menu item
        //var ModuleView = _.findWhere(this.modules, { name: data.get('name') }).View.extend({})

        var ModuleView = _.findWhere(this.modules, { name: name }).View.extend({})


        console.log("ModuleView:",ModuleView)
        //todo: this is by now the most elegant way i figured out to load the module view
        //it work accesing to the root view  
        //this.getRegion().currentView
        if (this.getView() 
            .renderContent(new ModuleView())){
                return true
            }else{
                return false
            }
        
            // this.region.showChildView('page', new Backbone.View({ initialize: function () { console.log('backboneview rendereds') } }))

        //setting the displayed flag on module data
        
    },
    getCurrentModuleView:function(){
        return this.getRegion.currentView
    },
    kamanInit: function () {

        this.mergeOptions(this.options, _.keys(this.options));
    },
    buildMainMenu: function () {
         //building the menu fom modules array that should be passed when extending this object
        return _.map(this.modules, function (v, k) {
            return _.pick(v, 'caption', 'name', 'icon')
        });
    },
    
    initialize: function () {
        this.kamanInit()
        console.log('kamanapp insTance ', this)
        if (this.config.get('debug'))
            console.log('kamanApp name: ' + this.config.get('name')
                + '\nwas initialized, and will be rendered on '
                + this.config.get('nodeSelector'))

        this.region = this.config.get('nodeSelector');

        this.ui = new this.Ui({

            appChannel: this.getChannel()//we pass the appchanel to use}),
        })
        /*
        this.ui = new KamanUi.Object({

            name: 'KamanApp UI',
            langSource: this.langSource,
            appChannel: this.getChannel()//we pass the appchanel to use

        });*/


        
       // Backbone.Radio.channel('kaman:ui').request('menu').reset(this.buildMainMenu())

        //Backbone.Radio.channel('kaman:ui').request('menu:build')

        if (!_.isElement($(this.region)[0])) {
            console.warn('kamanApp: ' + this.config.get('name') + '\nit seams that ' + this.config.get('nodeSelector') + ' is not a DOM element')
        }
        //this.interface.set_mainView()
    },

    onStart: function () {
        if (this.config.get('debug'))
            console.log('kamanApp: ' + this.name + '\nstarting')



        this.showView(this.ui.mainView)

    }
})

module.exports = Kapp;
