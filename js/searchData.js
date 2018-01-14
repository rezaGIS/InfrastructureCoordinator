var data = [{}];
// Variables
function initDgrid() {
    require([
    "esri/map",
    "dojo/Deferred",
    "esri/toolbars/draw",
    "dojo/ready",
    "dojo/on",
    "dojo/dom",
    "esri/geometry/Polygon",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/PictureFillSymbol",
    "esri/symbols/CartographicLineSymbol",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/graphic",
    "esri/Color",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/parser",
    "dojo/_base/array",
    "dojo/store/Memory",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dojo/_base/declare",
    "dojo/promise/all",
    "dojo/domReady!"
    ], function (
    Map,
    Deferred,
    Draw,
    ready,
    on,
    dom,
    Polygon,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    CartographicLineSymbol,
    IdentifyTask,
    IdentifyParameters,
    Graphic,
    Color,
    Query,
    QueryTask,
    parser,
    array,
    Memory,
    Grid,
    Selection,
    declare,
    all
    ) {
        parser.parse();
        var tempStoreVar = [];
        var memStore = new Memory({ data: data });
        /*-- Reference dictionary for xml --*/
        var querySearchDictionary = [
             { name: "yrZones100", url: url_yrZones100 },
             { name: "yrZonesFloodway100", url: url_yrZonesFloodway100 },
             { name: "baseFloodElev", url: url_baseFloodElev },
             { name: "firmPanels", url: url_firmPanels },
             { name: "indianReservationBoundary", url: url_indianReservationBoundary },
             { name: "yrZones500", url: url_yrZones500 },
             { name: "zoneXFuture", url: url_zoneXFuture },
             { name: "zoneXLess1Foot", url: url_zoneXLess1Foot },
             { name: "modelFlowPaths", url: url_modelFlowPaths },
			 { name: "CDOTRR", url: url_railroads },
			 { name: "CDOTLocal", url: url_localroads },
			 { name: "CDOTMajor", url: url_majorroads },
			 { name: "CDOTHwys", url: url_highways }
        ];
        var queryStore = [];
        /*-- Create datagrid --*/
        grid = new (declare([Grid, Selection]))({
            bufferRows: Infinity,
            columns: {
                "layerName": "LAYER NAME",
                "agency": "AGENCY",
                "contactName": "CONTACT",
                "phone": "PHONE",
                "email": "EMAIL",
                "description": "DESCRIPTION"
            }
        }, "grid");
        /*-- Polygon draw styling --*/
        var selectionOutline =
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color('#000'),
            1
        );
        /*-- Polygon start --*/
        $('#Polygon').click(function () {
            map.graphics.clear();
            data = [{}];
            var memStore = new Memory({ data: data });
            grid.set("store", memStore);
            initToolbar();
        });
        function initToolbar() {
            tb = new Draw(map);
            tb.on("draw-end", addGraphic);
            on(dom.byId("info"), "click", function (evt) {
                if (evt.target.id === "info") {
                    return;
                }
                var tool = evt.target.id.toLowerCase();
                map.disableMapNavigation();
                tb.activate(tool);
            });
        }
        /*-- Create graphic from polygon tool --*/
        function addGraphic(evt) {
            var promises; // Promise needed to handle async calls
            tb.deactivate();
            map.enableMapNavigation();
            poly = new Polygon(evt.geometry)
            var zoomTo = poly.getExtent();
            var graphic = new Graphic(poly, selectionOutline);
            map.graphics.add(graphic);
            querySearch = new Query();
            querySearch.outFields = ["*"];
            querySearch.geometry = poly;
            var feature;
            map.setExtent((zoomTo).expand(1.2)); 
            executeSearch();
            function executeSearch() {  // Query mapservices to see what exists in search area
                var queryDataList = [];
                querySearchDictionary.forEach(function (dictionary) {
                    DEBUG && console.log(dictionary.url)
                    querySearchTask = new QueryTask(dictionary.url);  // Save to variable for promise
                    var qs = querySearchTask.execute(querySearch, function (results) { // Save to variable for promise
                        if (results.features.length == 0) {
                            DEBUG && console.log("this guy doesn't meet " + dictionary.name);
                        }
                        else if (results.features.length > 0) {
                            var promisesPopulate; 
                            queryDataList.push(dictionary.name);
                            promises = all([qs]) // Waits until data is found before continuing search in xml for reference data
                            promises.then(function () { 
                                DEBUG && console.log("made it through promise in results.")
                                DEBUG && console.log("these guys are ok " + dictionary.name);
                                $.ajax({
                                    type: "GET",
                                    url: "contacts.xml",
                                    dataType: "xml",
                                    async: false, // disabled async to workaround lag for first xml grab... causing loss of data.. need solution 
                                    success: function (xml) {
                                        $(xml).find(dictionary.name).each(function () {
                                            titleTempXml = $(this).find('title').text();
                                            phoneTempXml = $(this).find('phone').text();
                                            agencyTempXml = $(this).find('agency').text();
                                            contactNameTempXml = $(this).find('name').text();
                                            emailTempXml = $(this).find('email').text();
                                            descTempXml = $(this).find('description').text();
                                        });
                                    }
                                });
                                promisesPopulate = all([titleTempXml, agencyTempXml, agencyTempXml, contactNameTempXml, phoneTempXml, emailTempXml, descTempXml]) // Waits until all data is found in xml then updates grid
                                promisesPopulate.then(function () {
                                    DEBUG && console.log("second promise kept");
                                    var memStore = new Memory({ data: data });
                                    memStore.add({ layerName: titleTempXml, agency: agencyTempXml, contactName: contactNameTempXml, phone: phoneTempXml, email: emailTempXml, description: descTempXml })
                                    grid.set("store", memStore);
                                })
                            })
                        }
                    });
                })
            }
        };
    });
}

