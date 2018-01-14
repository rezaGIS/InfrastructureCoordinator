require(["esri/map", "esri/toolbars/draw", "dojo/on", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/graphic", "esri/Color", "dojo/Deferred", "esri/layers/FeatureLayer"],
function (Map, Draw, on, SimpleFillSymbol, SimpleLineSymbol, Graphic, Color, Deferred, FeatureLayer) {
    var tempDraw, projectGraphic;
    var projectLine = new SimpleLineSymbol();
    projectLine.setColor(new Color([26, 26, 26, 1]));
    var projectFill = new SimpleFillSymbol();
    projectFill.setOutline(projectLine);
    projectFill.setColor(new Color([132, 0, 168, 0.25]));
    /*-- Form handling of events --*/
    $('#criteriaSelect').change(function () {
        $('#inputCriteria').val($('#inputCriteria').val() + $(this).val() + ';' + '\n');
		DEBUG && console.log(criteriaSelect.value + " Selected")
    });
	$('#clearTextArea').click(function () {
        $('#inputCriteria').val('');
        DEBUG && console.log("Text area cleared");
    })
    $('#showProjects').click(function () {
        map.addLayer(crwg_projects);
        DEBUG && console.log("crwg_projects added.")
    });
    $('#hideProjects').click(function () {
        map.removeLayer(crwg_projects);
        DEBUG && console.log("crwg_projects removed.")
    });
    $('#saveForm').click(function () {
       $('#projectForm').find('input, textarea, select, button').attr('disabled', 'disabled');
       $("#projectDraw").removeClass('disabled');
    });
    $('#projectDraw').click(function () {
        tempDraw = new Draw(map, { showTooltips: true });
        tempDraw.activate(Draw.POLYGON)
        tempDraw.on("draw-end", addToMap);
    });
    $('#cancelForm').click(function () {
        $('#projectForm').find('input, select, button').removeAttr('disabled', 'disabled');
        $("#projectDraw").addClass('disabled');
        $('#projectSubmit').addClass('disabled');
        map.graphics.remove(projectGraphic);
    });
    /*-- Submission of data to Feature Service --*/
    function addToMap(evt) {
        tempDraw.deactivate();
        projectGraphic = new Graphic(evt.geometry, projectFill);
        map.graphics.add(projectGraphic);
        $("#projectDraw").addClass('disabled');
        $("#projectSubmit").removeClass('disabled');
    }
    $('#projectSubmit').click(function submitProject() { // Created a timestamp to reduce number of user inputs
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' +
            ('00' + date.getUTCHours()).slice(-2) + ':' +
            ('00' + date.getUTCMinutes()).slice(-2) + ':' +
            ('00' + date.getUTCSeconds()).slice(-2);
        if (confirm("Submit Project?") == true) {   // Sets attributes -- data from form       
            projectGraphic.setAttributes({
                "Project_Name": inputName.value,
                "Project_Org": inputOrg.value,
                "Project_Type": inputProjType.value,
                "Population_Affected": inputPopAffected.value,
                "Criteria_Manuals": inputCriteria.value,
                "Funding_Sources": inputFunding.value,
                "Project_Start_Date": inputStart.value,
                "Project_Complete_Date": inputEnd.value,
                "Public_Outreach": inputOutreach.value,
                "Created_By": inputCreateBy.value,
                "Email": inputEmail.value,
                "Created_On": date
            })
            DEBUG && console.log(projectGraphic.setAttributes);
            crwg_projects.applyEdits([projectGraphic], null, null); // Submits edits with attributes applied
        } else {
            return
        }
        map.graphics.remove(projectGraphic);
        crwg_projects.refresh();
        DEBUG && console.log("Project Submitted.");
    });
})