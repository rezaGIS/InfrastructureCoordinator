var myEditor;
function initEditor() {
    require([
        "esri/map",
        "esri/tasks/GeometryService",
        "esri/layers/FeatureLayer",
        "esri/Color",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/dijit/editing/Editor",
        "esri/dijit/editing/TemplatePicker",
        "esri/config",
        "dojo/i18n!esri/nls/jsapi",
        "dojo/_base/array", "dojo/parser", "dojo/keys",
        "dojo/dom-construct",
        "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/registry",
        "dojo/domReady!"
    ], function (
        Map, GeometryService, FeatureLayer,
        Color, SimpleMarkerSymbol, SimpleLineSymbol,
        Editor, TemplatePicker,
        esriConfig, jsapiBundle,
        arrayUtils, parser, keys, domConstruct, BorderContainer, ContentPane, registry
      ) {

        $('#enableEditor').click(function () {
            identifyMapEvent.remove();
            var initPickerListener = map.on("layers-add-result", initPicker);
            map.addLayers([crwg_projects]);
            $('#enableEditor').prop('disabled', true);
            initPickerListener.remove();
        })
        $('#showProjects').click(function () {
            map.addLayers([crwg_projects]);
            DEBUG && console.log("crwg_projects added.")
        })
        $('#hideProjects').click(function () {
            map.removeLayer(crwg_projects);
            DEBUG && console.log("crwg_projects removed.")
        })
        function initPicker(evt) {
            PROJECTTOOL = true;
            DEBUG && console.log("PROJECTTOOL:" + PROJECTTOOL);
            DEBUG && console.log("initEditor");
            //domConstruct.destroy('templateDivPicker');         
            var templateLayers = arrayUtils.map(evt.layers, function (result) {
                return crwg_projects;
            });
            var templatePicker = new TemplatePicker({
                featureLayers: templateLayers,
                style: "height: 100%;"
            }, "templateDivPicker");
            templatePicker.startup();
           DEBUG && console.log(templatePicker);
            var layers = arrayUtils.map(evt.layers, function (result) {
                return { featureLayer: result.layer };
            });
            var settings = {
                map: map,
                templatePicker: templatePicker,
                layerInfos: layers,
                toolbarVisible: true,
                createOptions: {
                    polylineDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYLINE],
                    polygonDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYGON,
                      Editor.CREATE_TOOL_CIRCLE,
                      Editor.CREATE_TOOL_TRIANGLE,
                      Editor.CREATE_TOOL_RECTANGLE
                    ]
                },
                toolbarOptions: {
                    reshapeVisible: true
                }
            };

            var params = { settings: settings };
            var myEditor = new Editor(params, 'editorDiv');
 
            //define snapping options
            var symbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CROSS,
              15,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0, 0.5]),
                5
              ),
              null
            );
            map.enableSnapping({
                snapPointSymbol: symbol,
                tolerance: 20,
                snapKey: keys.ALT
            });

            myEditor.startup();
             
            
        };
       
    })

};