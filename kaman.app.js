
var Promise = require('bluebird')
var radio = require('backbone.radio')
var Mn = require('backbone.marionette');
var kamanCore = require('kaman-core');
var kamanUi = require('kaman-ui');


var kamanFunctions = kamanCore.Functions
var config = radio.channel('KamanApp').request('config');
//var interface=require('kaman-ui')

var Kapp = Mn.Application.extend({
    name: 'Kaman App',
    channelName: 'KamanApp',
    region: '#root',

    ui: kamanUi,
    interface: new kamanUi.Object({
        
        name: 'KamanApp UI',
        langSource:this.langSource,
        appChannel: 'KamanApp'
    }),

    kamanInit: function () {
      
        return kamanFunctions.omitBackboneOptsAsProps(this)
    },
    initialize: function () {
        console.log('langsource',this.getOption('langSource'))
        this.kamanInit()
            .then(function () {
                if (config.get('debug'))
                    console.log('kamanApp: ' + config.get('name')
                        + '\nwas initialized and will be rendered on '
                        + config.get('nodeSelector'))

                this.region = config.get('nodeSelector');


                if (!_.isElement($(this.region)[0])) {
                    console.warn('kamanApp: ' + config.get('name') + '\nit seams that ' + config.get('nodeSelector') + ' is not a DOM element')
                }


                //this.interface.set_mainView()

            }.bind(this))
    },

    onStart: function () {
        if (config.get('debug'))
            console.log('kamanApp: ' + this.name + '\nstarting')



        this.showView(this.interface.mainView)

    }
})

module.exports = Kapp;
