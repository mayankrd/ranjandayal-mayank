/**
 * Created by mayank on 10/17/16.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController)

    function WidgetListController($routeParams, WidgetService, $sce)
    {
        console.log("widget list controller");
        var vm = this;
        var pid = $routeParams.pid;

        var promise = WidgetService.findWidgetsByPageId(pid);
        promise.success(function (widgets) {
            vm.widgets = widgets;
        });

        function init() {
            vm.pageId = pid;
            vm.userId = $routeParams.uid;
            vm.websiteId = $routeParams.wid;
            vm.checkSafeHtml = checkSafeHtml;
            vm.checkSafeYoutubeUrl = checkSafeYoutubeUrl;
        }
        init();

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function checkSafeYoutubeUrl(url) {
            var parts = url.split('/');
            var id = parts[parts.length - 1];
            url = "https://www.youtube.com/embed/" +id;
            console.log(url);
            return $sce.trustAsResourceUrl(url);
        }

    }

    function NewWidgetController($routeParams, WidgetService, $location)
    {
        var vm = this;
        var userId = $routeParams.uid;
        var pageId = $routeParams.pid;

        function init() {

            vm.pageId = pageId;
            vm.userId = userId;
            vm.websiteId=$routeParams.wid;

            var promise = WidgetService.getAllWidgetTypes();
            promise.success(function (widgetTypes) {
                vm.widgetTypes = widgetTypes;
            })

            vm.createWidget = createWidget;
            console.log("inside NewWidgetControllerInit");

        }
        init();

        function createWidget(widgetType)
        {
            var widget = {"widgetType": widgetType};
            var promise = WidgetService.getDefaultWidgetValues();
            console.log("createWidget called from controller");
            console.log(promise);
            var defaultWidgetValues;
            promise
                .success(function(allDefaultWidgetVals) {
                    console.log("success controller");
                    console.log(allDefaultWidgetVals);
                    var defaultWidgetValues = allDefaultWidgetVals[widgetType];
                    console.log(defaultWidgetValues);
                    if( undefined !== defaultWidgetValues)
                    {
                        for (var key in defaultWidgetValues)
                        {
                            widget[key] = defaultWidgetValues[key];
                        }
                    }
                    console.log(widget);
                    var promise = WidgetService.createWidget(vm.pageId, widget);
                    promise.success(function (newWidgetRes) {
                        $location.url("/user/" + vm.userId +"/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + newWidgetRes._id);
                    })
                });


            //var defaultWidgetValues = allDefaultWidgetValues[widgetType];



        }
    }

    function EditWidgetController($routeParams, WidgetService)
    {

        var vm = this;

        var promise = WidgetService.findWidgetById($routeParams.wgid);
        console.log(promise);
        promise.success(function (widgetRes) {
            console.log("widget res");
            console.log(widgetRes);
            vm.widget = widgetRes;
            vm.getFilenamePrefix = getFilenamePrefix;
        });

        function init()
        {
            vm.userId=$routeParams.uid;
            vm.websiteId=$routeParams.wid;
            vm.pageId=$routeParams.pid;

        }
        init();

        function getFilenamePrefix()
        {
            /*
            console.log("inside filename prefix");
            var promise = WidgetService.getFilenamePrefix(vm.widget.widgetType);
            promise.success(function (widType) {
                return widType;
            })*/

            console.log("widget type:");
            console.log(vm.widget.widgetType);
            var prefix = WidgetService.getFilenamePrefix(vm.widget.widgetType);
            console.log("prefix:");
            console.log(prefix);
            return prefix;
        }
    }
/*    function WidgetChooseController() {  }
    function WidgetYoutubeController() {  }*/
})();