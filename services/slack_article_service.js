'use strict';

module.exports = function(pb) {

    //pb dependencies
    var util = pb.util;
    var BaseObjectService = pb.BaseObjectService;
    var DAO = new pb.DAO;
    var PluginService = pb.PluginService;

    /**
     * Monitors article changes and send notifications to Slack
     * @class SlackArticleService
     * @constructor
     * @extends BaseObjectService
     */
    function SlackArticleService() {}
    util.inherits(SlackArticleService, BaseObjectService);

    /**
     * The name of the DB collection where the resources are persisted
     * @private
     * @static
     * @readonly
     * @property TYPE
     * @type {String}
     */
    var TYPE = 'article';

    /**
     * The name the service
     * @private
     * @static
     * @readonly
     * @property SERVICE_NAME
     * @type {String}
     */
    var SERVICE_NAME = 'SlackArticleService';

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
    SlackArticleService.init = function(cb) {
        pb.log.debug("SlackArticleService: Initialized");
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
    SlackArticleService.getName = function() {
        return SERVICE_NAME;
    };

    /**
     * Provides a mechanism to inspect an object just after it is persisted
     * NOTE: We don't return errors, as the Slack notification service is not crucial to running PB and as such
     * errors will only be logged.
     * @static
     * @method afterSave
     * @param {Object} context
     * @param {Boolean} context.isCreate Indicates if this is a creation operation
     * @param {Boolean} context.isUpdate Indicates if the this is an update operation
     * @param {Object} context.data The object that is to be validated before persistence
     * @param {Array} context.validationErrors The array that can be added to in
     * order to supply your own validation errors
     * @param {SlackArticleService} context.service An instance of the service that triggered
     * the event that called this handler
     * @param {Function} cb A callback that takes a single parameter: an error if occurred
     * @
     */
    SlackArticleService.afterSave = function(context, cb) {
        if (!context.isCreate) {
            return cb(null);
        }
        console.log('afterSave called');
        var self = this;
        var SlackService = PluginService.getService('SlackService', 'slack-pencilblue', context.site);

        this.slackService = new SlackService(context);
        DAO.loadById(context.data.author, 'user', function (err, user) {
            if (err) {
                pb.log.error(err);
                return cb(null);
            }

            var msg = '';

            if (context.data.draft) {
                msg = user.username + ' just published a new draft: <'
                    + pb.config.siteRoot + '/preview/article/' + context.data._id + '|Preview>';
            } else {
                msg = user.username + ' just published a new article: <'
                    + pb.config.siteRoot + '/article/' + context.data.url + '|View>';
            }

            self.slackService.send(msg, function (error) {
                if (error) {
                    pb.log.error(error);
                    return cb(null);
                }
                return cb(null);
            });
        });
    };

    BaseObjectService.on(TYPE + '.' + BaseObjectService.AFTER_SAVE, SlackArticleService.afterSave);

    //exports
    return SlackArticleService;
};
