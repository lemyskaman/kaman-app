
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


    radioRequests: {
        'module:show': 'moduleShow',
        
    },
    moduleShow: function (data) {
        console.log('module to show ' + data.get('name'));

        console.log(new _.findWhere(this.modules,{name:data.get('name')}).MainView())
        //with underscore first we search for a module with the proper name and then
        // we get its view constructor and build a view and pass a parameter 
        //this.region.showChildView('page',new _.findWhere(this.modules,{name:data.get('name')}).MainView())

        data.set({ status: true })
    },
    kamanInit: function () {

        this.mergeOptions(this.options, _.keys(this.options));
    },
    initialize: function () {
        this.kamanInit()
        console.log('kamanapp insrance ', this)
        if (config.get('debug'))
            console.log('kamanApp: ' + config.get('name')
                + '\nwas initialized and will be rendered on '
                + config.get('nodeSelector'))

        this.region = config.get('nodeSelector');

        this.ui = new KamanUi.Object({

            name: 'KamanApp UI',
            langSource: this.langSource,
            appChannel: this.getChannel()//we pass the appchanel to use

        });


        //building the menu
        var menu = _.map(this.modules, function (v, k) {
            return _.pick(v,'caption','name','icon')            
        });
        Backbone.Radio.channel('kaman:ui').request('menu').reset(menu)

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
