
var Promise = require('bluebird')
var radio = require('backbone.radio')
var Mn = require('backbone.marionette');
var kamanCore = require('kaman-core');
var KamanUi = require('kaman-ui');


var kamanFunctions = kamanCore.Functions
var config = radio.channel('kaman:app').request('config');
//var interface=require('kaman-ui')




var Kapp = Mn.Application.extend({

    channelName: 'kaman:app',
    region: '#root',

    ui: {},
    radioRequests: {
        'module:show': 'moduleShow',
        'modules':function(){return this.modules}

    },
    moduleShow: function (data) {
        console.log('module to show ' + data.get('name'));

        //console.log(new _.findWhere(this.modules,{name:data.get('name')}).MainView())
        //with underscore first we search for a module with the proper name and then
        // we get its view constructor and build a view and pass a parameter 
        //this.region.showChildView('page',new _.findWhere(this.modules,{name:data.get('name')}).MainView())




        //we get the view constructor from the passed module array using the name from the data of  the clicked menu item
        var ModuleView = _.findWhere(this.modules, { name: data.get('name') }).View.extend({})



        //we get the name of the place to load modules 
        var modulesDisplayRegionName = radio.channel('kaman:ui').request('modules:display:region_name')
        console.log(modulesDisplayRegionName);
        //the we render the new module view
        console.log(this.getRegion())
        //todo: this is by now the most elegant way i figured out to load the module view
        //it work accesing to the root view  
        //this.getRegion().currentView
        this.getView() 
            .renderContent(ModuleView, function () { console.log('rendered') })
        // this.region.showChildView('page', new Backbone.View({ initialize: function () { console.log('backboneview rendereds') } }))

        //setting the displayed flag on module data
        data.set({ status: true })
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
        if (config.get('debug'))
            console.log('kamanApp name: ' + config.get('name')
                + '\nwas initialized, and will be rendered on '
                + config.get('nodeSelector'))

        this.region = config.get('nodeSelector');

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
            console.warn('kamanApp: ' + config.get('name') + '\nit seams that ' + config.get('nodeSelector') + ' is not a DOM element')
        }
        //this.interface.set_mainView()
    },

    onStart: function () {
        if (config.get('debug'))
            console.log('kamanApp: ' + this.name + '\nstarting')



        this.showView(this.ui.mainView)

    }
})

module.exports = Kapp;
