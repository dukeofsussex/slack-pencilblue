'use strict';

//dependencies
var request = require('request');

module.exports = function(pb) {

    // pb dependencies
    var PluginSettingService = pb.PluginSettingService;

    function SlackService(context) {
        this.context = context;
        this.pluginSettingsService = new PluginSettingService(context.site);
    }

    /**
     * The name the service
     * @private
     * @static
     * @readonly
     * @property SERVICE_NAME
     * @type {String}
     */
    var SERVICE_NAME = 'SlackService';

    /**
     * This function is called when the service is being setup by the system.  It is
     * responsible for any setup that is needed when first created.  The services
     * are all instantiated at once and are not added to the platform untill all
     * initialization is complete.  Relying on other plugin services in the
     * initialization could result in failure.
     *
     * @static
     * @method init
     * @param {Function} cb A callback that should provide one argument: cb(error) or cb(null)
     * if initialization proceeded successfully.
     */
    SlackService.init = function(cb) {
        pb.log.debug("SlackService: Initialized");
        return cb(null, true);
    };

    /**
     * A service interface function designed to allow developers to name the handle
     * to the service object what ever they desire. The function must return a
     * valid string and must not conflict with the names of other services for the
     * plugin that the service is associated with.
     *
     * @static
     * @method getName
     * @return {String} The service name
     */
    SlackService.getName = function() {
        return SERVICE_NAME;
    };

    /**
     * As the name suggests, this function handles the actual sending of the message to Slack.
     * @param {String} message The message to be sent to Slack
     * @param {Function} cb A callback that should provide one argument: cb(error) or cb(null)
     * if sending was completed successfully.
     */
    SlackService.prototype.send = function(message, cb) {
        this.pluginSettingsService.getSettingsKV('slack-pencilblue', function(err, settings) {
            if (err) {
                return cb(err);
            } else if (!settings.slack_pencilblue_enabled) {
                pb.log.debug('SlackService: Disabled, skipping sending');
                return cb(null);
            }

            var payload = {
                text: message
            };

            pb.log.debug('SlackService: Sending message to webhook');
            request.post(settings.slack_pencilblue_webhook_url, {
                body: JSON.stringify(payload)
            }, function (err) {
                if (err) {
                    return cb(err);
                }

                pb.log.debug('SlackService: Successfully sent message to webhook');
                return cb(null);
            });
        });
    };

    //exports
    return SlackService;
};