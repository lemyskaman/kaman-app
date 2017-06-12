
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


    radioRequests:{
      'module:show':'moduleShow'
    },
    moduleShow:function(data){
      console.log('module to show '+data.get('action'));

      
      data.set({status:true})
    },
    kamanInit: function () {

        this.mergeOptions(this.options,_.keys(this.options));
    },
    initialize: function () {
        this.kamanInit()
        console.log('kamanapp insrance ',this)
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
