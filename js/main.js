/*-- Global Variables --*/
var data = [];
var coloradoExtent;
var toc, crwgData, dynaLayer2, featLayer1, tocListener, crwgPopup;
var tabHandler = "infoActivate";
require([
    //toc
    "agsjs/dijit/TOC",
    //esri
    "esri/config",
    "esri/Color",
    "esri/map",
    "esri/InfoTemplate",
    "esri/arcgis/utils",
    "esri/dijit/LayerList",
    "esri/dijit/Legend",
    "esri/dijit/Popup",
    "esri/dijit/PopupTemplate",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer", 
    "esri/layers/FeatureLayer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/tasks/GeometryService",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    //dojox
    "dojox/data/XmlStore",
    //dojo
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/parser",
    "dojo/on",
    "dojo/ready",
    "dojo/i18n!esri/nls/jsapi",
    "dojo/domReady!"
], function (
    //toc
    TOC,
    //esri
    esriConfig,
    Color,
    Map,
    InfoTemplate,
    arcgisUtils,
    LayerList,
    Legend,
    Popup,
    PopupTemplate,
    Extent,
    ArcGISDynamicMapServiceLayer,
    FeatureLayer,
    ClassBreaksRenderer,
    GeometryService,
    SimpleFillSymbol,
    SimpleLineSymbol,
    //dojox
    XmlStore,
    //dojo
    arrayUtils,
    connect,
    declare,
    Deferred,
    dom,
    domConstruct,
    parser,
    on,
    ready,
    jsapiBundle
    ) {
    /*-- Controller for firing scripts in order --*/
    ready(function initReady() {
        initApp();
        initMap();
        initMapServices();
        initDgrid();
        //initIdentify();
    })
    /*-- Some utilities for app --*/
    function initApp() {
        DEBUG && console.log("initApp");
        parser.parse();
        jsapiBundle.toolbars.draw.start = jsapiBundle.toolbars.draw.start + "<br>Press <b>ALT</b> to enable snapping";
        esriConfig.defaults.geometryService = new GeometryService("http://maps.co.gov/copubgis/rest/services/Utilities/Geometry/GeometryServer");
        coloradoExtent = new Extent(-109.205, 36.944, -101.919, 41.039);
    }
    /*-- Creates initial map for layers to be added to --*/
    function initMap() {
        DEBUG && console.log("initMap")
        var popup = new Popup({  // Popup styling
            fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
        }, domConstruct.create("div"));
        map = new Map("mapDiv", {
            basemap: "topo",
            zoom: 7,
            sliderStyle: "large",
            minZoom: 7,
            extent: coloradoExtent,
            infoWindow: popup
        });
    }
    /*-- Sets initial visibility of mapservices --*/
    function initTOC(evt) {
        crwgData.setVisibleLayers([1]);
        socioDemographic.setVisibleLayers([]);
        toc = new TOC({  //Table of Contents info
            map: map,
            layerInfos: [
            {
                layer: crwgData,
                title: "CWRG Data"
            },
            {
                layer: socioDemographic,
                title: "Demographics",
                collapsed: true
            }]
        }, 'tocDiv');
        toc.startup();
        toc.on('load', function () {
            if (console)
                DEBUG && console.log('TOC loaded');
        });
        toc.on('toc-node-checked', function (evt) { // controls TOC hierarchy
            if (console) {
                DEBUG && console.log("TOCNodeChecked, rootLayer:"
                + (evt.rootLayer ? evt.rootLayer.id : 'NULL')
                + ", serviceLayer:" + (evt.serviceLayer ? evt.serviceLayer.id : 'NULL')
                + " Checked:" + evt.checked);
                if (evt.checked && evt.rootLayer && evt.serviceLayer) {
                    // evt.rootLayer.setVisibleLayers([evt.serviceLayer.id])
                }
            }
        });
        tocListener.remove();
    };
    /*-- Define and call all mapservices for application --*/
    function initMapServices() {
        crwgPopup = new PopupTemplate({  //Popup for CRWG_Projects
            format: {dateFormat: 'shortDate'},
            title: "Reported Projects",
            description: "<b>Project Name</b>: {Project_Name}</br>" + "<b>Project Org</b>: {Project_Org}</br>" +
                "<b>Population Affected</b>: {Population_Affected}</br>" + "<b>Criterial Manual Used</b>: {Criteria_Manuals}</br>" +
                "<b>Funding Sources</b>: {Funding_Sources}</br>" + "<b>Project Start Date</b>: {Project_Start_Date:DateFormat(selector: 'date', fullYear: true)}</br>" +
                "<b>Project Start Date</b>: {Project_Complete_Date:DateFormat(selector: 'date', fullYear: true)}</br>" +
                "<b>Public Notification</b>: {Public_Outreach}</br>" + "<b>Created By</b>: {Created_By}</br>" + "<b>Created on</b>:{Created_On}</br"
        });
        DEBUG && console.log("initMapservices");       
        crwgData = new ArcGISDynamicMapServiceLayer(url_crwgData, {});
        socioDemographic = new ArcGISDynamicMapServiceLayer(url_socioDemographic, {});
        crwg_projects = new FeatureLayer(url_crwg_projects, {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            infoTemplate: crwgPopup
        });
        tocListener = map.on('layers-add-result', initTOC);
        map.addLayers([crwgData, socioDemographic]);
    }

    // I DONT LIKE HOW THIS IS SET UP, FEELS CLUNKY
    //$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    //    var tabHandler = $(e.target).attr("name") // activated tab
    //    DEBUG && console.log(tabHandler);
    //    if (tabHandler == 'infoActivate') {
    //        DEBUG && console.log("Identify task is enabled");
    //        //DEBUG && console.log(identifyMapEvent);
    //        IDENTIFYTOOL = true;
    //        if (PROJECTTOOL) {
    //            PROJECTTOOL = false;
    //            map.removeLayer(crwg_projects)
    //        }
    //        if (SEARCHTOOL) {
    //            SEARCHTOOL = false;
    //        }
    //        //initIdentify();
    //        toc.refresh();
    //    }
    //    if (tabHandler == 'legendActivate') {
    //        DEBUG && console.log("legend activated");
    //       // DEBUG && console.log(identifyMapEvent);
    //        IDENTIFYTOOL = true;
    //        if (SEARCHTOOL) {
    //            SEARCHTOOL = false;
    //        }
    //        if (PROJECTTOOL) {
    //            PROJECTTOOL = false;
    //            map.removeLayer(crwg_projects)               
    //        }
    //        //initIdentify();
    //    }
    //    if (tabHandler == 'searchActivate') {
    //        DEBUG && console.log("Search for data activated");
    //        //DEBUG && console.log(identifyMapEvent);
    //        SEARCHTOOL = true;
    //        if (PROJECTTOOL) {
    //            PROJECTTOOL = false;
    //            map.removeLayer(crwg_projects)
    //        }
    //        if (IDENTIFYTOOL) {
    //            DEBUG && console.log("IDENTIFYTOOL IF STATEMENT HIT");
    //            IDENTIFYTOOL = false;
    //            //identifyMapEvent.remove();
    //            //clearMapservices();
    //        }
    //    }
    //    if (tabHandler == 'projectActivate') {
    //        DEBUG && console.log("Project creation activated");
    //        //DEBUG && console.log(identifyMapEvent);
    //        // map.infoWindow.hide();
    //        //identifyMapEvent.remove();
    //        IDENTIFYTOOL = false;
    //        PROJECTTOOL = true;
    //        //clearMapservices();  
    //    }
    //});
    function clearMapservices() {
        crwgData.setVisibleLayers([]);
        age17under.setVisibleLayers([]);
        age65older.setVisibleLayers([]);
        ambulatory.setVisibleLayers([]);
        cognative.setVisibleLayers([]);
        hearing.setVisibleLayers([]);
        indLiving.setVisibleLayers([]);
        changeMap.setVisibleLayers([]);
        selfcare.setVisibleLayers([]);
        vision.setVisibleLayers([]);
        dme.setVisibleLayers([]);
        eduAttain.setVisibleLayers([]);
        inclusionInst.setVisibleLayers([]);
        mentalHealth.setVisibleLayers([]);
        mobile.setVisibleLayers([]);
        popvsInc.setVisibleLayers([]);
        popDensity.setVisibleLayers([]);
        race.setVisibleLayers([]);
        recentMoveIn.setVisibleLayers([]);
        singParent.setVisibleLayers([]);
        totDisability.setVisibleLayers([]);
        transportDis.setVisibleLayers([]);
    };
});



