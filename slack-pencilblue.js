'use strict';

module.exports = function(pb) {

    /**
     * SlackPencilbluePlugin - Slack integration for Pencilblue
     * @class SlackPencilbluePlugin
     * @constructor
     */
    function SlackPencilbluePlugin(){}

    /**
     * Called when the application is being installed for the first time.
     * @static
     * @method onInstallWithContext
     * @param {object} context
     * @param {string} context.site
     * @param {function} cb (Error, Boolean) A callback that must be called upon completion.
     * The result should be TRUE on success and FALSE on failure
     */
    SlackPencilbluePlugin.onInstallWithContext = function(context, cb) {
        cb(null, true);
    };

    /**
     * Called when the application is uninstalling this plugin.  The plugin should
     * make every effort to clean up any plugin-specific DB items or any in function
     * overrides it makes.
     * @static
     * @method onUninstallWithContext
     * @param {object} context
     * @param {string} context.site
     * @param {function} cb (Error, Boolean) A callback that must be called upon completion.
     * The result should be TRUE on success and FALSE on failure
     */
    SlackPencilbluePlugin.onUninstallWithContext = function (context, cb) {
        cb(null, true);
    };

    /**
     * Called when the application is starting up. The function is also called at
     * the end of a successful install. It is guaranteed that all core PB services
     * will be available including access to the core DB.
     * @static
     * @method onStartupWithContext
     * @param {object} context
     * @param {string} context.site
     * @param {function} cb (Error, Boolean) A callback that must be called upon completion.
     * The result should be TRUE on success and FALSE on failure
     */
    SlackPencilbluePlugin.onStartupWithContext = function (context, cb) {
        cb(null, true);
    };

    /**
     * Called when the application is gracefully shutting down.  No guarantees are
     * provided for how much time will be provided the plugin to shut down or which
     * services will be available at shutdown
     * @static
     * @method onShutdown
     * @param {function} cb (Error, Boolean) A callback that must be called upon completion.
     * The result should be TRUE on success and FALSE on failure
     */
    SlackPencilbluePlugin.onShutdown = function(cb) {
        cb(null, true);
    };

    //exports
    return SlackPencilbluePlugin;
};
