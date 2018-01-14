/*-- DEBUG --*/
var DEBUG = false;  // Set to false on deployment
/*-- Variables --*/
var poly;
var grid;
var IDENTIFYTOOL = true;
var PROJECTTOOL = false;
var SEARCHTOOL = false;
var infoTemplate; //Popup
/*-- XML Variables --*/
var phoneTempXml;
var titleTempXml;
var agencyTempXml;
var contactNameTempXml;
var emailTempXml;
var descTempXml;
/*-- searchData.js Queries URLS--*/
var url_modelFlowPaths = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/6";
var url_baseFloodElev = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/7";
var url_firmPanels = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/15";
var url_LOMR = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/16";
var url_yrZones100 = "https://gis.colorado.gov/public/services/CRWG/CRWG_Data/MapServer/8";
var url_yrZonesFloodway100 = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/9";
var url_yrZones500 = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/10";
var url_zoneXFuture = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/12";
var url_zoneXLess1Foot = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/11";
var url_zoneXLevee = "https://gis.colorado.gov/public/rest/rest/services/CRWG/CRWG_Data/MapServer/13";
var url_indianReservationBoundary = "http://www.cohealthmaps.dphe.state.co.us/arcgis/rest/services/COMMUNITY_INCLUSION/COLORADO_COMMUNITY_INCLUSION_BOUNDARIES/MapServer/1 ";
var url_railroads = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/4";
var url_localroads = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/3";
var url_majorroads = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/2";
var url_highways = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer/1";
/*-- OIT Hosted Data URLS--*/
var url_crwgData = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Data/MapServer";
var url_crwg_projects = "https://gis.colorado.gov/public/rest/services/CRWG/CRWG_Projects/FeatureServer/0"; //sde FeatureService
/*-- Community Inclusion Change Mapservices URLS --*/
var url_socioDemographic = "http://www.cohealthmaps.dphe.state.co.us/arcgis/rest/services/COMMUNITY_INCLUSION/COLORADO_COMMUNITY_INCLUSION_SOCIODEMOGRAPHIC_DISABILITY/MapServer"
/*-- Layer Variables --*/
var crwg_projects; // Feature layer Variables
var crwgData; // Dyanmic layer variables
var crwgCDOT;
var counties;
var socioDemographic
/*-- Listeners --*/
var identifyMapEvent;

