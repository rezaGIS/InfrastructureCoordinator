/* CURRENTLY NOT IN USE */

var identifyMapEvent;
function initIdentify() {
    require([
        "esri/map",
        "esri/InfoTemplate",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "esri/dijit/Popup",
        "dojo/_base/array",
        "esri/Color",
        "dojo/dom-construct",
        "dojo/domReady!"
    ], function (
        Map, InfoTemplate, ArcGISDynamicMapServiceLayer, SimpleFillSymbol,
        SimpleLineSymbol, IdentifyTask, IdentifyParameters, Popup,
        arrayUtils, Color, domConstruct
      ) {
        var identifyTask, identifyParams;

        var identifyUrl = "https://gis.co.gov/oitprod10/rest/services/CRWG/CRWG/MapServer";
        DEBUG && console.log("map ready")
        identifyMapEvent = map.on("click", executeIdentifyTask);
        //create identify tasks and setup parameters
        identifyTask = new IdentifyTask(identifyUrl);
        identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 2;
        identifyParams.returnGeometry = true;
        //identifyParams.layerIds = ["*"];
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.width = map.width;
        identifyParams.height = map.height;

        function executeIdentifyTask(event) {
            identifyParams.geometry = event.mapPoint;
            identifyParams.mapExtent = map.extent;
            var deferred = identifyTask
              .execute(identifyParams)
              .addCallback(function (response) {
                  // response is an array of identify result objects
                  // Let's return an array of features.
                  return arrayUtils.map(response, function (result) {
                      var feature = result.feature;
                      var layerName = result.layerName;
                      DEBUG && console.log(result.feature);
                      feature.attributes.layerName = layerName;
                      if (layerName === 'FIRM_Panels') {
                          var firmPanelsTemplate = new InfoTemplate("Flood Ins Rate Model",
                            "<b>Description:</b> Official map of a community on which FEMA has delineated the Special Flood Hazard Areas (SFHAs), the Base Flood Elevations (BFEs) and the risk premium zones applicable to the community</br>" +
                            "<b>Panel Type:</b> ${PANEL_TYP}" +  "</br><b>Reason:</b> ${PNP_REASON}");
                          feature.setInfoTemplate(firmPanelsTemplate);
                      }
                      else if (layerName === 'ModelingFlowpaths') {                   
                          var flowpathsTemplate = new InfoTemplate("Modeling Flowpaths",
                            "<b>Description:</b> A spatial data set consisting of lines showing the flow path used for floodplain modelling and mapping</br>" + 
                            "<b>Waterway</b>: ${WTR_NM}");
                          feature.setInfoTemplate(flowpathsTemplate);
                      }
                      else if (layerName === 'BaseFloodElevations') {
                          var baseFloodElevTemplate = new InfoTemplate("Base Flood Elevation",
                            "<b>Description:</b> Location and attributes for base flood elevations lines shown on the FIRM</br>" +
                            "<b>Elevation</b>: ${ELEV} " + "${LEN_UNIT}");
                          feature.setInfoTemplate(baseFloodElevTemplate);
                      }
                      else if (layerName === 'LOMR') {
                          var LOMRTemplate = new InfoTemplate("Letter of Map Revision",
                            "<b>Description:</b> An official amendment to the currently effective FEMA map. It is issued by FEMA and changes flood zones, delineations and elevations</br>" + 
                            "<b>Status</b>: ${STATUS}");
                          feature.setInfoTemplate(LOMRTemplate);
                      }
                      else if (layerName === 'S_100yr_Zones_FLOODWAY') {
                          var zonesFloodwayTemplate = new InfoTemplate("100 Year Flood Zones Floodway",
                            "<b>Description:</b> All Zone AE with Floodway");
                          feature.setInfoTemplate(zonesFloodwayTemplate);
                      }
                      else if (layerName === 'S_100yr_Zones') {
                          var zonesTemplate = new InfoTemplate("100 Year Flood Zones",
                            "<b>Description:</b> All Zone comprising the 1% annual chance flood otherwise referred to as the “Base Flood” or “100 year flood”.  (Zones A, AE, AO, AH) without Floodway");
                          feature.setInfoTemplate(zonesTemplate);
                      }
                      else if (layerName === 'S_500yr_Zones') {
                          var zones500Template = new InfoTemplate("500 Year Flood Zones",
                            "<b>Description:</b> All Zone X, 0.2% annual chance flood otherwise referred to as “500 year flood”");
                          feature.setInfoTemplate(zones500Template);
                      }
                      else if (layerName === 'S_ZoneX_1pct_FutureCond') {
                          var futureCondTemplate = new InfoTemplate("Future Condition Zone",
                            "<b>Description:</b> Zone X Future Conditions of possible flood zones");
                          feature.setInfoTemplate(futureCondTemplate);
                      }
                      else if (layerName === 'S_ZoneX_1pct_lessThan1Foot') {
                          var lessFootTemplate = new InfoTemplate("Minimal Flood Hazard",
                            "<b>Description:</b> Areas determined to be outside the 1% and 0.2% annual chance floodplains");
                          feature.setInfoTemplate(lessFootTemplate);
                      }
                      else if (layerName === 'S_ZoneX_Levee') {
                          var leveeTemplate = new InfoTemplate("Levee Flood Zone",
                            "<b>Description:</b> Zone X areas with reduced flood risk due to levee");
                          feature.setInfoTemplate(leveeTemplate);
                      }
                      return feature;
                  });
              });
            map.infoWindow.setFeatures([deferred]);
            map.infoWindow.show(event.mapPoint);
        }
    })
}