/*
 * Cerberus Copyright (C) 2013 - 2017 cerberustesting
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This file is part of Cerberus.
 *
 * Cerberus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cerberus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Cerberus.  If not, see <http://www.gnu.org/licenses/>.
 */
$.when($.getScript("js/global/global.js")).then(function () {
    $(document).ready(function () {
        initPage();

        $('[data-toggle="popover"]').popover({
            'placement': 'auto',
            'container': 'body'}
        );
    });
});

function initPage() {
    displayPageLabel();

    // handle the click for specific action buttons
    $("#editTestcampaignButton").click(editEntryModalSaveHandler);
    $("#addTestcampaignButton").click(addEntryModalSaveHandler);

    //clear the modals fields when closed
    $('#editTestcampaignModal').on('hidden.bs.modal', editEntryModalCloseHandler);
    $('#addTestcampaignModal').on('hidden.bs.modal', addEntryModalCloseHandler);
    $('#viewTestcampaignModal').on('hidden.bs.modal', viewEntryModalCloseHandler);

    displayInvariantList("notifystart", "CAMPAIGNSTARTNOTIF", false);
    displayInvariantList("notifyend", "CAMPAIGNENDNOTIF", false);
    displayInvariantList("notifySlackstart", "CAMPAIGNSTARTNOTIF", false);
    displayInvariantList("notifySlackend", "CAMPAIGNENDNOTIF", false);
    displayInvariantList("screenshot", "SCREENSHOT", false, undefined, "");
    displayInvariantList("verbose", "VERBOSE", false, undefined, "");
    displayInvariantList("pageSource", "PAGESOURCE", false, undefined, "");
    displayInvariantList("robotLog", "SELENIUMLOG", false, undefined, "");
    displayInvariantList("retries", "RETRIES", false, undefined, "");
    displayInvariantList("manualExecution", "MANUALEXECUTION", false, undefined, "");
    
    $('#editTestcampaignModal a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href"); // activated tab
        if (target == "#tabsCreate-1") {
        } else if (target == "#tabsCreate-3") {
            $("#parameterTestcampaignsTable").DataTable().draw();
        } else if (target == "#tabsCreate-4") {
            $("#labelTestcampaignsTable").DataTable().draw();
        } else if (target == "#tabsCreate-5") {
            $("#parameterTestcaseTable").DataTable().draw();
        }
    });

    $('#addTestcampaignModal a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href"); // activated tab
        if (target == "#tabsCreate-11") {
        } else if (target == "#tabsCreate-13") {
            $("#addModalParameterTestcampaignsTable").DataTable().draw();
        } else if (target == "#tabsCreate-14") {
            $("#addModalLabelTestcampaignsTable").DataTable().draw();
        } else if (target == "#tabsCreate-5") {
            $("#parameterTestcaseTable").DataTable().draw();
        }
    });

    $("#viewTestcampaignModal").on('shown.bs.modal', function (e) {
        $("#viewTestcampaignsTable").DataTable().columns.adjust();
    })

    //configure and create the dataTable
    var configurations = new TableConfigurationsServerSide("testcampaignsTable", "ReadCampaign", "contentTable", aoColumnsFunc(), [1, 'asc']);
    createDataTableWithPermissions(configurations, renderOptionsForCampaign, "#testcampaignList", undefined, true);
}

function displayPageLabel() {
    var doc = new Doc();

    $("#title").html(doc.getDocLabel("page_testcampaign", "allTestcampaigns"));
    $("[name='editTestcampaignField']").html(doc.getDocLabel("page_testcampaign", "edittestcampaign_field"));
    $("[name='addTestcampaignField']").html(doc.getDocLabel("page_testcampaign", "addtestcampaign_field"));
    $("[name='campaignField']").html(doc.getDocLabel("page_testcampaign", "campaign_field"));
    $("[name='tagField']").html(doc.getDocOnline("campaign", "tag"));
    
    $("[name='descriptionField']").html(doc.getDocOnline("page_testcampaign", "description_field"));
    $("[name='tabDescription']").html(doc.getDocLabel("page_testcampaign", "description_tab"));
    $("[name='tabLabels']").html(doc.getDocLabel("label", "label"));
    $("[name='tabParameters']").html(doc.getDocLabel("page_testcampaign", "parameter_tab"));
    $("[name='buttonClose']").html(doc.getDocLabel("page_testcampaign", "close_btn"));
    $("[name='buttonAdd']").html(doc.getDocLabel("page_testcampaign", "button_create"));
    $("[name='buttonEdit']").html(doc.getDocLabel("page_testcampaign", "save_btn"));

    $("[name='distriblistField']").html(doc.getDocOnline("testcampaign", "distribList"));
    $("[name='notifystartField']").html(doc.getDocOnline("testcampaign", "notifyStartTagExecution"));
    $("[name='notifyendField']").html(doc.getDocOnline("testcampaign", "notifyEndTagExecution"));

    displayHeaderLabel(doc);

    displayFooter(doc);
    displayGlobalLabel(doc);
}

function renderOptionsForCampaign(data) {
    var doc = new Doc();
    if (data["hasPermissions"]) {
        if ($("#createTestcampaignButton").length === 0) {
            var contentToAdd = "<div class='marginBottom10'><button id='createTestcampaignButton' type='button' class='btn btn-default'>\n\
            <span class='glyphicon glyphicon-plus-sign'></span> " + doc.getDocLabel("page_testcampaign", "button_create") + "</button></div>";
            $("#testcampaignsTable_wrapper div#testcampaignsTable_length").before(contentToAdd);
            $('#testcampaignList #createTestcampaignButton').click(addEntryClick);
        }
    }
}
//
//function renderOptionsForCampaign_Label(tableId) {
//    var doc = new Doc();
//    var data = getSelectInvariant("SYSTEM", false, true, "");
//    $("#" + tableId + "_wrapper #addLabelTestcampaign").remove();
//    var contentToAdd =
//            "<div class='marginBottom10 form-inline' id='addLabelTestcampaign'>" +
//            "<div class='form-group marginRight10 col-sm-3' style='padding-right: 0px; padding-left: 0px;'>" +
//            "<select id='labelSelect' class='form-control' style='width:100%;' onchange='updateSelectLabel(\"" + tableId + "\")'>";
//    for (var i = 0; i < data.find("option").length; i++) {
//        contentToAdd +=
//                "<option value='" + data.find("option")[i].value + "'>" + data.find("option")[i].value + "</option>";
//    }
//    contentToAdd +=
//            "</select>" +
//            "</div>" +
//            "<div class='form-group marginRight10 col-sm-3' style='padding-right: 0px; padding-left: 0px;'>" +
//            "<select id='labelSelect2' class='form-control' style='width:100%;'>" +
//            "</select>" +
//            "</div>" +
//            "<div class='form-group'>" +
//            "<button type='button' id='addLabelTestcampaignButton' disabled='true' class='btn btn-primary' name='ButtonEdit' onclick='addLabelEntryClick(\"" + tableId + "\")'>" + doc.getDocLabel("page_testcampaign", "add_btn") + "</button>" +
//            "</div>" +
//            "</div>";
//    $("#" + tableId + "_wrapper div#" + tableId + "_length").before(contentToAdd);
//    $("#" + tableId + "_wrapper #labelSelect").select2();
//
//    $("#" + tableId + "_wrapper #labelSelect2").select2(camp_getComboConfigLabel("", "", tableId));
//    $('#labelSelect2').on('select2:select', function (e) {
//        $('#addLabelTestcampaignButton').prop("disabled", false);
//    });
//
//    updateSelectLabel(tableId);
//
//}
//
//function camp_getComboConfigLabel(labelType, system, tableId) {
//
//    var config =
//            {
//                ajax: {
//                    url: "ReadLabel?bStrictSystemFilter=Y&iSortCol_0=0&sSortDir_0=desc&sColumns=type&iDisplayLength=30&sSearch_0=" + labelType + "&system=" + system,
//                    dataType: 'json',
//                    delay: 250,
//                    data: function (params) {
//                        params.page = params.page || 1;
//                        return {
//                            sSearch: params.term, // search term
//                            iDisplayStart: (params.page * 30) - 30
//                        };
//                    },
//                    processResults: function (data, params) {
//                        params.page = params.page || 1;
////                        console.info(data);
//                        return {
//                            results: $.map(data.contentTable, function (obj) {
//                                if (!(findValueTableDataByCol(tableId, 4, obj.label))) {
//                                    return {id: obj.id, label: obj.label, color: obj.color, description: obj.description, system: obj.system, type: obj.type};
//                                }
//                            }),
//                            pagination: {
//                                more: (params.page * 30) < data.iTotalRecords
//                            }
//                        };
//                    },
//                    cache: true,
//                    allowClear: true
//                },
//                width: "100%",
//                escapeMarkup: function (markup) {
//                    return markup;
//                }, // let our custom formatter work
//                minimumInputLength: 0,
//                templateResult: camp_comboConfigLabel_format, // omitted for brevity, see the source of this page
//                templateSelection: camp_comboConfigLabel_formatSelection // omitted for brevity, see the source of this page
//            };
//
//    return config;
//}
//
//function camp_comboConfigLabel_format(label) {
//    var markup = "<div class='select2-result-tag clearfix'>" +
//            "<div style='float:left;'><span class='label label-primary' style='background-color:"
//            + label.color + "' data-toggle='tooltip' data-labelid='"
//            + label.id + "' title='"
//            + label.description + "'>"
//            + label.label + "</span></div>";
//
//    markup += "</div>";
//
//    return markup;
//}
//
//function camp_comboConfigLabel_formatSelection(label) {
//    var result = label.id;
//    if (!isEmpty(label.label)) {
//        result = "<div style='float:left;height: 34px'><span class='label label-primary' style='background-color:"
//                + label.color + "' data-toggle='tooltip' data-labelid='"
//                + label.id + "' title='"
//                + label.description + "'>"
//                + label.label + "</span></div>";
//    }
//    return result;
//}
//
//
//
//function renderOptionsForCampaign_Parameter(id) {
//    var doc = new Doc();
//    var data = getSelectInvariant("CAMPAIGN_PARAMETER", false, true);
//    $("#" + id + "_wrapper #addParameterTestcampaign").remove();
//    var contentToAdd =
//            "<div class='marginBottom10 form-inline' id='addParameterTestcampaign'>" +
//            "<div class='form-group marginRight10 col-sm-3' style='padding-right: 0px; padding-left: 0px;'>" +
//            "<select id='parameterTestSelect' class='form-control' style='width:100%;' onchange='updateSelectParameter(\"" + id + "\")'>";
//    for (var i = 0; i < data.find("option").length; i++) {
//        contentToAdd +=
//                "<option value='" + data.find("option")[i].value + "'>" + data.find("option")[i].value + "</option>";
//    }
//    contentToAdd +=
//            "</select>" +
//            "</div>" +
//            "<div class='form-group marginRight10 col-sm-3' style='padding-right: 0px; padding-left: 0px;'>" +
//            "<select id='parameterTestSelect2' class='form-control' style='width:100%;'>" +
//            "</select>" +
//            "</div>" +
//            "<div class='form-group'>" +
//            "<button type='button' id='addParameterTestcampaignButton' class='btn btn-primary' name='ButtonEdit' onclick='addParameterEntryClick(\"" + id + "\")'>" + doc.getDocLabel("page_testcampaign", "add_btn") + "</button>" +
//            "</div>" +
//            "</div>";
//    $("#" + id + "_wrapper div#" + id + "_length").before(contentToAdd);
//    $("#" + id + "_wrapper #parameterTestSelect").select2();
//    $("#" + id + "_wrapper #parameterTestSelect2").select2();
//    updateSelectParameter(id);
//
//}
//
//function renderOptionsForCampaign_TestcaseCriterias(id) {
//    var doc = new Doc();
//    var data = getSelectInvariant("CAMPAIGN_TCCRITERIA", false, true);
//    $("#" + id + "_wrapper #addParameterTestcase").remove();
//    var contentToAdd =
//            "<div class='marginBottom10 form-inline' id='addParameterTestcase'>" +
//            "<div class='form-group marginRight10 col-sm-3' style='padding-right: 0px; padding-left: 0px;'>" +
//            "<select id='criteriaTestSelect' class='form-control' style='width:100%;' onchange='updateSelectCriteria(\"" + id + "\")'>";
//    for (var i = 0; i < data.find("option").length; i++) {
//        contentToAdd +=
//                "<option value='" + data.find("option")[i].value + "'>" + data.find("option")[i].value + "</option>";
//    }
//    contentToAdd +=
//            "</select>" +
//            "</div>" +
//            "<div class='form-group marginRight10 col-sm-3' style='padding-right: 0px; padding-left: 0px;'>" +
//            "<select id='criteriaTestSelect2' class='form-control' style='width:100%;'>" +
//            "</select>" +
//            "</div>" +
//            "<div class='form-group'>" +
//            "<button type='button' id='addCriteriaTestcampaignButton' class='btn btn-primary' name='ButtonEdit' onclick='addCriteriaEntryClick(\"" + id + "\")'>" + doc.getDocLabel("page_testcampaign", "add_btn") + "</button>" +
//            "</div>" +
//            "</div>";
//    $("#" + id + "_wrapper div#" + id + "_length").before(contentToAdd);
//    $("#" + id + "_wrapper #criteriaTestSelect").select2();
//    $("#" + id + "_wrapper #criteriaTestSelect2").select2();
//    updateSelectCriteria(id);
//
//}
//
//function renderOptionsForCampaign_TestCase(data) {
//}
//
//function viewEntryClick(param) {
//    clearResponseMessageMainPage();
//
//    var doc = new Doc();
//    var formEdit = $('#viewTestcampaignModal');
//
//    $("[name='viewTestcampaignField']").html(doc.getDocLabel("page_testcampaign", "viewtestcampaign_field") + " " + param);
//
//    $("#campaignKey").val(param);
//
//    showLoader("#testcampaignList");
//
//
//    var jqxhr = $.getJSON("ReadCampaign?testcase=true&tag=true&", "campaign=" + param);
//    $.when(jqxhr).then(function (data) {
//        var obj = data["contentTable"];
//
//        /* TESTCASE */
//
//        var array = [];
//
//        $.each(obj.testcase, function (e) {
//            array.push(
//                    [obj.testcase[e].test, obj.testcase[e].testCase, obj.testcase[e].application, obj.testcase[e].description, obj.testcase[e].status]
//                    );
//        });
//
//        if ($("#viewTestcampaignModal #viewTestcampaignsTable_wrapper").length > 0) {
//            $("#viewTestcampaignModal #viewTestcampaignsTable").DataTable().clear();
//            $("#viewTestcampaignModal #viewTestcampaignsTable").DataTable().rows.add(array).draw();
//
//        } else {
//            //configure and create the dataTable
//            var configurations = new TableConfigurationsClientSide("viewTestcampaignsTable", array, aoColumnsFunc_TestCase(), true);
//            createDataTableWithPermissions(configurations, renderOptionsForCampaign_TestCase, "#viewTestcampaignList", undefined, true);
//        }
//
//        /* TAG */
//
//        var array = [];
//
//        $.each(obj.tag, function (e) {
//            array.push(
//                    [obj.tag[e], obj.tag[e].tag, obj.tag[e].nbExe, obj.tag[e].nbExeUsefull, obj.tag[e].DateCreated, obj.tag[e].DateEndQueue, obj.tag[e].ciResult, obj.tag[e].ciScore]
//                    );
//        });
//
//        if ($("#viewTestcampaignModal #viewTagcampaignsTable_wrapper").length > 0) {
//            $("#viewTestcampaignModal #viewTagcampaignsTable").DataTable().clear();
//            $("#viewTestcampaignModal #viewTagcampaignsTable").DataTable().rows.add(array).draw();
//
//        } else {
//            //configure and create the dataTable
//            var configurations = new TableConfigurationsClientSide("viewTagcampaignsTable", array, aoColumnsFunc_Tag(), true, [1, 'desc']);
//            createDataTableWithPermissions(configurations, renderOptionsForCampaign_TestCase, "#viewTagcampaignList", undefined, true);
//        }
//
//
//
//        hideLoader("#testcampaignList");
//
//        formEdit.modal('show');
//
//    });
//
//}
//
//function viewEntryModalCloseHandler() {
//    // reset form values
//    // remove all errors on the form fields
//    $(this).find('div.has-error').removeClass("has-error");
//    // clear the response messages of the modal
//    clearResponseMessage($('#viewTestcampaignModal'));
//}
//
//function editEntryClick(param) {
//    clearResponseMessageMainPage();
//
//    //Store the campaign name
//    $("#campaignKey").val(param);
//
//    var formEdit = $('#editTestcampaignModal');
//
//    showLoader("#testcampaignList");
//
//    var jqxhr = $.getJSON("ReadCampaign?parameter=true&label=true", "campaign=" + param);
//    $.when(jqxhr).then(function (data) {
//        var obj = data["contentTable"];
//        var parameters = []
//        var criterias = []
//
//        for (var i = 0; i < obj.parameter.length; i++)
//        {
//            if ((obj.parameter[i].parameter === "BROWSER")
//                    || (obj.parameter[i].parameter === "COUNTRY")
//                    || (obj.parameter[i].parameter === "ENVIRONMENT")
//                    || (obj.parameter[i].parameter === "ROBOT")) {
//                parameters.push(obj.parameter[i])
//            } else {
//                criterias.push(obj.parameter[i])
//            }
//        }
//
//        formEdit.find("#campaign").prop("value", obj["campaign"]);
//        formEdit.find("#notifystart").val(obj["notifyStartTagExecution"]);
//        formEdit.find("#notifyend").val(obj["notifyEndTagExecution"]);
//        formEdit.find("#distriblist").prop("value", obj["distribList"]);
//        formEdit.find("#notifySlackstart").val(obj["SlackNotifyStartTagExecution"]);
//        formEdit.find("#notifySlackend").val(obj["SlackNotifyEndTagExecution"]);
//        formEdit.find("#webhook").val(obj["SlackWebhook"]);
//        formEdit.find("#channel").val(obj["SlackChannel"]);
//        formEdit.find("#cIScoreThreshold").val(obj["CIScoreThreshold"]);
//        formEdit.find("#description").prop("value", obj["description"]);
//        formEdit.find("#longDescription").prop("value", obj["longDescription"]);
//        formEdit.find("#id").prop("value", obj["campaignID"]);
//
//        if (!(data["hasPermissions"])) { // If readonly, we only readonly all fields
//            formEdit.find("#campaign").prop("readonly", "readonly");
//            formEdit.find("#description").prop("readonly", "readonly");
//            formEdit.find("#id").prop("readonly", "readonly");
//
//            $('#editTestcampaignButton').attr('class', '');
//            $('#editTestcampaignButton').attr('hidden', 'hidden');
//        }
//
//        /* LABEL */
//
//        var array = [];
//
//        $.each(obj.label, function (e) {
//            array.push(
//                    [obj.label[e].campaign, obj.label[e].campaignLabelID, obj.label[e].LabelId, obj.label[e].label.system, obj.label[e].label.label, obj.label[e].label.color, obj.label[e].label.description, obj.label[e].label.type]
//                    );
//        });
//
//        if ($("#editTestcampaignModal #labelTestcampaignsTable_wrapper").length > 0) {
//            $("#editTestcampaignModal #labelTestcampaignsTable").DataTable().clear();
//            $("#editTestcampaignModal #labelTestcampaignsTable").DataTable().rows.add(array).draw();
//        } else {
//            //configure and create the dataTable
//            var configurations = new TableConfigurationsClientSide("labelTestcampaignsTable", array, aoColumnsFunc_Label("labelTestcampaignsTable"), true);
//            createDataTableWithPermissions(configurations, null, "#labelTestcampaignList", undefined, true);
//        }
//        renderOptionsForCampaign_Label("labelTestcampaignsTable");
//
//        /* PARAMETERS */
//
//        var array = [];
//
//        $.each(parameters, function (e) {
//            array.push([parameters[e].campaign, parameters[e].campaignparameterID, parameters[e].parameter, parameters[e].value])
//        });
//
//        if ($("#editTestcampaignModal #parameterTestcampaignsTable_wrapper").length > 0) {
//            $("#editTestcampaignModal #parameterTestcampaignsTable").DataTable().clear();
//            $("#editTestcampaignModal #parameterTestcampaignsTable").DataTable().rows.add(array).draw();
//        } else {
//            //configure and create the dataTable
//            var configurations = new TableConfigurationsClientSide("parameterTestcampaignsTable", array, aoColumnsFunc_Parameter("parameterTestcampaignsTable"), true);
//            createDataTableWithPermissions(configurations, null, "#parameterTestcampaignList", undefined, true);
//        }
//        renderOptionsForCampaign_Parameter("parameterTestcampaignsTable");
//        hideLoader("#testcampaignList");
//
//        $('#editTestcampaignModal .nav-tabs a[href="#tabsCreate-1"]').tab('show');
//        formEdit.modal('show');
//
//        /* CRITERIAS */
//
//        var array = [];
//
//        $.each(criterias, function (e) {
//            array.push([criterias[e].campaign, criterias[e].campaignparameterID, criterias[e].parameter, criterias[e].value])
//        });
//
//        if ($("#editTestcampaignModal #parameterTestcaseTable_wrapper").length > 0) {
//            $("#editTestcampaignModal #parameterTestcaseTable").DataTable().clear();
//            $("#editTestcampaignModal #parameterTestcaseTable").DataTable().rows.add(array).draw();
//        } else {
//            //configure and create the dataTable
//            var configurations = new TableConfigurationsClientSide("parameterTestcaseTable", array, aoColumnsFunc_Parameter("parameterTestcaseTable"), true);
//            createDataTableWithPermissions(configurations, null, "#parameterTestcaseTable", undefined, true);
//        }
//
//        renderOptionsForCampaign_TestcaseCriterias("parameterTestcaseTable")
//
//        hideLoader("#testcampaignList");
//
//        $('#editTestcampaignModal .nav-tabs a[href="#tabsCreate-1"]').tab('show');
//        formEdit.modal('show');
//
//
//    });
//
//}
//
//function editEntryModalSaveHandler() {
//    clearResponseMessage($('#editTestcampaignModal'));
//    var formEdit = $('#editTestcampaignModal #editTestcampaignModalForm');
//
//    var sa = formEdit.serializeArray();
//    var data = {}
//    for (var i in sa) {
//        data[sa[i].name] = sa[i].value;
//    }
//
//    var labels = null;
//    if ($("#labelTestcampaignsTable_wrapper").length > 0) {
//        labels = $("#labelTestcampaignsTable").DataTable().data().toArray();
//    }
//
//    var parameters = null;
//    if ($("#parameterTestcampaignsTable_wrapper").length > 0) {
//        parameters = $("#parameterTestcampaignsTable").DataTable().data().toArray();
//    }
//
//    var criterias = null
//    if ($("#parameterTestcaseTable_wrapper").length > 0) {
//        criterias = $("#parameterTestcaseTable").DataTable().data()
//        for (let i = 0; i < criterias.length; i++) {
//            parameters.push(criterias[i])
//        }
//    }
//
//    // Get the header data from the form.
//    //var data = convertSerialToJSONObject(formEdit.serialize());
//
//    showLoaderInModal('#editTestcampaignModal');
//    $.ajax({
//        url: "UpdateCampaign",
//        async: true,
//        method: "POST",
//        data: {
//            Campaign: data.campaign,
//            CampaignID: data.id,
//            DistribList: data.distriblist,
//            NotifyStart: data.notifystart,
//            NotifyEnd: data.notifyend,
//            Description: data.description,
////            Batteries: JSON.stringify(batteries),
//            Labels: JSON.stringify(labels),
//            Parameters: JSON.stringify(parameters)
//        },
//        success: function (data) {
////            data = JSON.parse(data);
//            hideLoaderInModal('#editTestcampaignModal');
//            if (getAlertType(data.messageType) === 'success') {
//                var oTable = $("#testcampaignsTable").dataTable();
//                oTable.fnDraw(false);
//                $('#editTestcampaignModal').modal('hide');
//                showMessage(data);
//            } else {
//                showMessage(data, $('#editTestcampaignModal'));
//            }
//        },
//        error: showUnexpectedError
//    });
//
//}
//
//function editEntryModalCloseHandler() {
//    // reset form values
//    $('#editTestcampaignModal #editTestcampaignModalForm')[0].reset();
//    // remove all errors on the form fields
//    $(this).find('div.has-error').removeClass("has-error");
//    // clear the response messages of the modal
//    clearResponseMessage($('#editTestcampaignModal'));
//}
//
//function addEntryClick() {
//    clearResponseMessageMainPage();
//    $("#addTestcampaignModal #campaign").empty();
//
//    // LABEL
//    if ($("#addModalLabelTestcampaignsTable_wrapper").length > 0) {
//        $("#addModalLabelTestcampaignsTable").DataTable().clear().draw();
//    } else {
//        //configure and create the dataTable
//        var configurations = new TableConfigurationsClientSide("addModalLabelTestcampaignsTable", null, aoColumnsFunc_Label("addModalLabelTestcampaignsTable"), true);
//        createDataTableWithPermissions(configurations, null, "#addModalLabelTestcampaignList", undefined, true);
//    }
//    renderOptionsForCampaign_Label("addModalLabelTestcampaignsTable");
//
//    // PARAMETER
//    if ($("#addModalParameterTestcampaignsTable_wrapper").length > 0) {
//        $("#addModalParameterTestcampaignsTable").DataTable().clear().draw();
//    } else {
//        //configure and create the dataTable
//        var configurations = new TableConfigurationsClientSide("addModalParameterTestcampaignsTable", null, aoColumnsFunc_Parameter("addModalParameterTestcampaignsTable"), true);
//        createDataTableWithPermissions(configurations, null, "#addModalParameterTestcampaignList", undefined, true);
//    }
//    renderOptionsForCampaign_Parameter("addModalParameterTestcampaignsTable");
//
//    // CRITERIA
//
//    if ($("#addModalParameterTestcaseTable_wrapper").length > 0) {
//        $("#addModalParameterTestcaseTable").DataTable().clear().draw();
//    } else {
//        //configure and create the dataTable
//        var configurations = new TableConfigurationsClientSide("addModalParameterTestcaseTable", null, aoColumnsFunc_Parameter("addModalParameterTestcaseTable"), true);
//        createDataTableWithPermissions(configurations, null, "#addModalParameterTestcaseList", undefined, true);
//    }
//    renderOptionsForCampaign_TestcaseCriterias("addModalParameterTestcaseTable");
//
//    $('#addTestcampaignModal .nav-tabs a[href="#tabsCreate-11"]').tab('show');
//    $('#addTestcampaignModal').modal('show');
//
//}
//
//function addEntryModalSaveHandler() {
//    clearResponseMessage($('#addTestcampaignModal'));
//    var formEdit = $('#addTestcampaignModal #addTestcampaignModalForm');
//
//    var sa = formEdit.serializeArray();
//    var data = {}
//    for (var i in sa) {
//        data[sa[i].name] = sa[i].value;
//    }
//
//    var labels = null;
//    if ($("#addModalLabelTestcampaignsTable_wrapper").length > 0) {
//        labels = $("#addModalLabelTestcampaignsTable").DataTable().data().toArray();
//    }
//    for (var i = 0; i < labels.length; i++) {
//        labels[i][0] = data.campaign;
//    }
//
//    var parameters = null;
//    if ($("#addModalParameterTestcampaignsTable_wrapper").length > 0) {
//        parameters = $("#addModalParameterTestcampaignsTable").DataTable().data().toArray();
//    }
//
//    var criterias = null
//    if ($("#addModalParameterTestcaseTable").length > 0) {
//        criterias = $("#addModalParameterTestcaseTable").DataTable().data()
//        for (let i = 0; i < criterias.length; i++) {
//            parameters.push(criterias[i])
//        }
//    }
//    for (var i = 0; i < parameters.length; i++) {
//        parameters[i][0] = data.campaign;
//    }
//    // Get the header data from the form.
//    //var data = convertSerialToJSONObject(formEdit.serialize());
//
//    showLoaderInModal('#addTestcampaignModal');
//    $.ajax({
//        url: "CreateCampaign",
//        async: true,
//        method: "POST",
//        data: {
//            Campaign: data.campaign,
//            DistribList: data.distriblist,
//            NotifyStart: data.notifystart,
//            NotifyEnd: data.notifyend,
//            NotifySlackStart: data.notifySlackstart,
//            NotifySlackEnd: data.notifySlackend,
//            SlackWebhook: data.webhook,
//            SlackChannel: data.channel,
//            CIScoreThreshold: data.cIScoreThreshold,            
//            Description: data.description,
//            Labels: JSON.stringify(labels),
//            Parameters: JSON.stringify(parameters)
//        },
//        success: function (data) {
////            data = JSON.parse(data);
//            hideLoaderInModal('#addTestcampaignModal');
//            if (getAlertType(data.messageType) === 'success') {
//                var oTable = $("#testcampaignsTable").dataTable();
//                oTable.fnDraw(false);
//                $('#addTestcampaignModal').modal('hide');
//                showMessage(data);
//            } else {
//                showMessage(data, $('#addTestcampaignModal'));
//            }
//        },
//        error: showUnexpectedError
//    });
//
//}
//
//function addEntryModalCloseHandler() {
//    // reset form values
//    $('#addTestcampaignModal #addTestcampaignModalForm')[0].reset();
//    // remove all errors on the form fields
//    $(this).find('div.has-error').removeClass("has-error");
//    // clear the response messages of the modal
//    clearResponseMessage($('#addTestcampaignModal'));
//}

function removeEntryClick(key) {
    var doc = new Doc();
    showModalConfirmation(function (ev) {
        var id = $('#confirmationModal #hiddenField1').prop("value");
        $.ajax({
            url: "DeleteCampaign?key=" + key,
            async: true,
            method: "GET",
            success: function (data) {
                hideLoaderInModal('#removeTestampaignModal');
                var oTable = $("#testcampaignsTable").dataTable();
                oTable.fnDraw(false);
                $('#removeTestcampaignModal').modal('hide');
                showMessage(data);
            },
            error: showUnexpectedError
        });
        $('#confirmationModal').modal('hide');
    }, undefined, doc.getDocLabel("page_testcampaign", "title_remove"), doc.getDocLabel("page_testcampaign", "message_remove").replace("%NAME%", key), key, undefined, undefined, undefined);
}
//
//function addLabelEntryClick(tableId) {
//
//    var v = $('#labelSelect2').select2('data')[0];
//
//    $("#" + tableId).DataTable().row.add([
//        $("#campaignKey").val(),
//        0,
//        v.id,
//        v.system,
//        v.label,
//        v.color,
//        v.description,
//        v.type
//    ]).draw();
//    $('#labelSelect2').val("").trigger('change');
//    $('#addLabelTestcampaignButton').prop("disabled", true);
//}
//
//function removeLabelEntryClick(tableId, key) {
//    $('#' + tableId + '_wrapper #removeLabel').filter(function (i, e) {
//        return $(e).attr("key") == key;
//    }).off().prop("disabled", true);
//    $("#" + tableId).DataTable().rows(function (i, d, n) {
//        return d[2] == key;
//    }).remove().draw();
//    updateSelectLabel(tableId);
//}
//
//function updateSelectLabel(tableId) {
//    var val = $("#" + tableId + '_wrapper #labelSelect').find(":selected").val();
//
//    $("#" + tableId + "_wrapper #labelSelect2").select2(camp_getComboConfigLabel("", val, tableId));
//
//    $("#addLabelTestcampaignButton").prop("disabled", true);
//
//    $("#" + tableId + '_wrapper #addLabelTestcampaignButton').prop("disabled", false);
//}
//
//function addParameterEntryClick(tableId) {
//    $("#" + tableId + '_wrapper #addParameterTestcampaignButton').off().prop("disabled", true);
//    $("#" + tableId).DataTable().row.add([$("#campaignKey").val()
//                , 0
//                , $("#" + tableId + '_wrapper #parameterTestSelect').find(":selected").val()
//                , $("#" + tableId + '_wrapper #parameterTestSelect2').find(":selected").val()]).draw();
//    updateSelectParameter(tableId);
//}
//
//function addCriteriaEntryClick(tableId) {
//    $("#" + tableId + '_wrapper #addCriteriaTestcampaignButton').off().prop("disabled", true);
//    $("#" + tableId).DataTable().row.add([$("#campaignKey").val()
//                , 0
//                , $("#" + tableId + '_wrapper #criteriaTestSelect').find(":selected").val()
//                , $("#" + tableId + '_wrapper #criteriaTestSelect2').find(":selected").val()]).draw();
//    updateSelectCriteria(tableId);
//}
//
//function removeParameterEntryClick(tableId, key, key1) {
//    $('#' + tableId + '_wrapper #removeTestbattery').filter(function (i, e) {
//        return $(e).attr("key") == key && $(e).attr("key1") == key1;
//    }).off().prop("disabled", true);
//    $("#" + tableId).DataTable().rows(function (i, d, n) {
//        return d[2] == key && d[3] == key1;
//    }).remove().draw()
//    updateSelectParameter(tableId);
//}

//function getSys() {
//    var sel = document.getElementById("MySystem");
//    var selectedIndex = sel.selectedIndex;
//    return sel.options[selectedIndex].value;
//}
//
//function updateSelectParameter(id) {
//    var val = $("#" + id + '_wrapper #parameterTestSelect').find(":selected").val();
//    var data = []
//
//    if (val === "ROBOT") {
//        data = getSelectRobot(true, true);
//    } else {
//        data = getSelectInvariant(val, false, true);
//    }
//
//    $("#" + id + "_wrapper #parameterTestSelect2").empty();
//    var optionList = "";
//    for (var i = 0; i < data.find("option").length; i++) {
//        if (!(findValueTableDataByCol(id, 2, val) && findValueTableDataByCol(id, 3, data.find("option")[i].value)))
//            optionList += "<option value='" + data.find("option")[i].value + "'>" + data.find("option")[i].text + "</option>";
//    }
//    $("#" + id + "_wrapper #parameterTestSelect2").append(optionList);
//    if ($("#" + id + '_wrapper #parameterTestSelect2 option').size() <= 0) {
//        $("#" + id + '_wrapper #parameterTestSelect2').parent().hide();
//        $("#" + id + '_wrapper #addParameterTestcampaignButton').prop("disabled", true);
//    } else {
//        $("#" + id + '_wrapper #parameterTestSelect2').parent().show();
//        $("#" + id + '_wrapper #addParameterTestcampaignButton').bind("click", function () {
//            addParameterEntryClick(id);
//        }).prop("disabled", false);
//    }
//}
//
//function updateSelectCriteria(id) {
//    var val = $("#" + id + '_wrapper #criteriaTestSelect').find(":selected").val();
//    var data = []
//    if (val === "STATUS") {
//        data = getSelectInvariant("TCSTATUS", false, true);
//    } else if (val === "APPLICATION") {
//        data = getSelectApplicationWithoutSystem();
//    } else {
//        data = getSelectInvariant(val, false, true);
//    }
//
//    $("#" + id + "_wrapper #criteriaTestSelect2").empty();
//    var optionList = "";
//    for (var i = 0; i < data.find("option").length; i++) {
//        if (!(findValueTableDataByCol(id, 2, val) && findValueTableDataByCol(id, 3, data.find("option")[i].value)))
//            optionList +=
//                    "<option value='" + data.find("option")[i].value + "'>" + data.find("option")[i].value + "</option>";
//    }
//    $("#" + id + "_wrapper #criteriaTestSelect2").append(optionList);
//    if ($("#" + id + '_wrapper #criteriaTestSelect2 option').size() <= 0) {
//        $("#" + id + '_wrapper #criteriaTestSelect2').parent().hide();
//        $("#" + id + '_wrapper #addCriteriaTestcampaignButton').prop("disabled", true);
//    } else {
//        $("#" + id + '_wrapper #criteriaTestSelect2').parent().show();
//        $("#" + id + '_wrapper #addCriteriaTestcampaignButton').bind("click", function () {
//            addCriteriaEntryClick(id);
//        }).prop("disabled", false);
//    }
//}
//
//function findValueTableDataByCol(tableId, colIndex, value) {
//    var result = false;
//    //Iterate all td's in second column
//    $.each($("#" + tableId).DataTable().rows().data(), function (i, v) {
//        if (v[colIndex] == value) {
//            result = true;
//        }
//    });
//    return result;
//}

function aoColumnsFunc(tableId) {
    var doc = new Doc();
    var aoColumns = [
        {
            "data": null,
            "bSortable": false,
            "bSearchable": false,
            "sWidth": "120px",
            "title": doc.getDocLabel("page_testcampaign", "button_col"),
            "mRender": function (data, type, obj) {
                var hasPermissions = $("#" + tableId).attr("hasPermissions");

                var editTestcampaign = '<button id="editTestcampaign" onclick="editEntryClick(\'' + obj["campaign"] + '\');"\n\
                                        class="editCampaign btn btn-default btn-xs margin-right5" \n\
                                        name="editTestcampaign" title="' + doc.getDocLabel("page_testcampaign", "button_edit") + '" type="button">\n\
                                        <span class="glyphicon glyphicon-pencil"></span></button>';
                var removeTestcampaign = '<button id="removeTestcampaign" onclick="removeEntryClick(\'' + obj["campaign"] + '\');"\n\
                                        class="removeTestcampaign btn btn-default btn-xs margin-right5" \n\
                                        name="removeTestcampaign" title="' + doc.getDocLabel("page_testcampaign", "button_remove") + '" type="button">\n\
                                        <span class="glyphicon glyphicon-trash"></span></button>';
                var viewTestcampaign = '<button id="viewTestcampaign" onclick="viewEntryClick(\'' + obj["campaign"] + '\');"\n\
                                        class="viewTestcampaign btn btn-default btn-xs margin-right5" \n\
                                        name="viewTestcampaign" title="' + doc.getDocLabel("page_testcampaign", "button_view") + '" type="button">\n\
                                        <span class="glyphicon glyphicon-eye-open"></span></button>';
                var Runcampaign = '<a id="runcampaign" class="btn btn-primary btn-xs margin-right5"\n\
                                    href="./RunTests.jsp?campaign=' + encodeURIComponent(obj["campaign"]) + '" title="' + doc.getDocLabel("page_testcampaign", "button_run") + '" >\n\
                                    <span class="glyphicon glyphicon-play"></span>\n\
                                    </a>';

                return '<div class="center btn-group">' + editTestcampaign + removeTestcampaign + viewTestcampaign + Runcampaign + '</div>';

            }
        },
        {"data": "campaign", "sName": "campaign", "sWidth": "80px", "title": doc.getDocLabel("page_testcampaign", "testcampaign_col")},
        {
            "data": "notifyStartTagExecution",
            "sName": "notifyStartTagExecution",
            "sWidth": "30px",
            "title": doc.getDocLabel("testcampaign", "notifyStartTagExecution")
        },
        {
            "data": "notifyEndTagExecution",
            "sName": "notifyEndTagExecution",
            "sWidth": "30px",
            "title": doc.getDocLabel("testcampaign", "notifyEndTagExecution")
        },
        {
            "data": "distribList",
            "sName": "distribList",
            "sWidth": "80px",
            "title": doc.getDocLabel("testcampaign", "distribList")
        },
        {
            "data": "SlackNotifyStartTagExecution",
            "sName": "SlackNotifyStartTagExecution",
            "sWidth": "30px",
            "title": doc.getDocLabel("testcampaign", "SlackNotifyStartTagExecution")
        },
        {
            "data": "SlackNotifyEndTagExecution",
            "sName": "SlackNotifyEndTagExecution",
            "sWidth": "30px",
            "title": doc.getDocLabel("testcampaign", "SlackNotifyEndTagExecution")
        },
        {
            "data": "SlackWebhook",
            "sName": "SlackWebhook",
            "sWidth": "80px",
            "title": doc.getDocLabel("testcampaign", "SlackWebhook")
        },
        {
            "data": "SlackChannel",
            "sName": "SlackChannel",
            "sWidth": "80px",
            "title": doc.getDocLabel("testcampaign", "SlackChannel")
        },
        {
            "data": "description",
            "sName": "description",
            "sWidth": "180px",
            "title": doc.getDocLabel("page_testcampaign", "description_col")
        }
    ];
    return aoColumns;
}

//function aoColumnsFunc_Label(tableId) {
//    var doc = new Doc();
//    var aoColumns = [
//        {
//            "data": null,
//            "bSortable": false,
//            "bSearchable": false,
//            "title": doc.getDocLabel("page_testcampaign", "button_col"),
//            "mRender": function (data, type, obj) {
//                var hasPermissions = $("#" + tableId).attr("hasPermissions");
//
//                var removeButton = '<button id="removeTestlabel" key="' + obj[2] + '" onclick="removeLabelEntryClick(\'' + tableId + '\',\'' + obj[2] + '\');"\n\
//                                        class="removeTestlabel btn btn-default btn-xs margin-right5" \n\
//                                        name="removeTestlabel" title="' + doc.getDocLabel("page_testcampaign", "button_remove") + '" type="button">\n\
//                                        <span class="glyphicon glyphicon-trash"></span></button>';
//
//                return '<div class="center btn-group">' + removeButton + '</div>';
//
//            }
//        },
//        {"data": "2", "sName": "labelId", "title": doc.getDocLabel("label", "id")},
//        {"data": "3", "sName": "system", "title": doc.getDocLabel("label", "system")},
//        {
//            "data": "4",
//            "sName": "label",
//            "title": doc.getDocLabel("label", "label"),
//            "mRender": function (data, type, obj) {
//                var result = "<div style='float:left;height: 34px'><span class='label label-primary' style='background-color:"
//                        + obj[5] + "' data-toggle='tooltip' data-labelid='"
//                        + obj[2] + "' title='"
//                        + obj[6] + "'>"
//                        + obj[4] + "</span></div>";
//                return result;
//
//            }
//        },
//        {"data": "7", "sName": "type", "title": doc.getDocLabel("label", "type")}
//    ];
//    return aoColumns;
//}
//
//function aoColumnsFunc_Parameter(tableId) {
//    var doc = new Doc();
//    var aoColumns = [
//        {
//            "data": null,
//            "bSortable": false,
//            "bSearchable": false,
//            "title": doc.getDocLabel("page_testcampaign", "button_col"),
//            "mRender": function (data, type, obj) {
//                var hasPermissions = $("#" + tableId).attr("hasPermissions");
//                var removeButton = '<button id="removeTestparameter" key="' + obj[2] + '" key1="' + obj[3] + '" onclick="removeParameterEntryClick(\'' + tableId + '\',\'' + obj[2] + '\',\'' + obj[3] + '\');"\n\
//                                        class="removeTestparameter btn btn-default btn-xs margin-right5" \n\
//                                        name="removeTestparameter" title="' + doc.getDocLabel("page_testcampaign", "button_remove") + '" type="button">\n\
//                                        <span class="glyphicon glyphicon-trash"></span></button>';
//
//                return '<div class="center btn-group">' + removeButton + '</div>';
//
//            }
//        },
//        {"data": "2", "sName": "parameter", "title": doc.getDocLabel("page_testcampaign", "parameter_col")},
//        {"data": "3", "sName": "value", "title": doc.getDocLabel("page_testcampaign", "value_col")}
//    ];
//    return aoColumns;
//}
//
//function aoColumnsFunc_TestCase() {
//    var doc = new Doc();
//    var aoColumns = [
//        {"data": "0", "sName": "tbc.Test", "title": doc.getDocLabel("test", "Test")},
//        {
//            "data": "1", "sName": "tbc.Testcase", "title": doc.getDocLabel("testcase", "TestCase"),
//            "mRender": function (data, type, obj) {
//                return "<a target=\"_blank\" href='TestCaseScript.jsp?test=" + obj[0] + "&testcase=" + obj[1] + "'>" + obj[1] + "</a>";
//            }
//        },
//        {"data": "2", "sName": "tbc.application", "title": doc.getDocLabel("application", "Application")},
//        {"data": "3", "sName": "tbc.description", "title": doc.getDocLabel("testcase", "Description")},
//        {"data": "4", "sName": "tec.status", "title": doc.getDocLabel("testcase", "Status")}
//    ];
//    return aoColumns;
//}
//
//function aoColumnsFunc_Tag() {
//    var doc = new Doc();
//    var aoColumns = [
//        {"data": "1", "sName": "Tag", "sWidth": "250px", "title": doc.getDocOnline("tag", "tag")},
//        {"data": "4", "sName": "DateCreated", "sWidth": "150px", "title": doc.getDocLabel("page_tag", "datecreated")},
//        {
//            "data": "6",
//            "sName": "ciresult",
//            "sWidth": "40px",
//            "mRender": function (data, type, obj) {
//                if (isEmpty(obj[0].ciResult)) {
//                    return "";
//                } else {
//                    return '<div class="progress-bar status' + obj[0].ciResult + '" role="progressbar" style="width:100%">' + obj[0].ciResult + '</div>';
//                }
//            },
//            "title": doc.getDocOnline("tag", "ciresult")
//        },
//        {
//            "data": null,
//            "sName": "result",
//            "sWidth": "150px",
//            "mRender": function (data, type, obj) {
//                return result(obj[0]);
//            },
//            "title": doc.getDocLabel("page_tag", "result")
//        },
//        {
//            "data": null,
//            "sName": "duration",
//            "sWidth": "40px",
//            className: 'dt-body-right',
//            "mRender": function (data, type, obj) {
//                return getDuration(obj[0]);
//            },
//            "title": doc.getDocOnline("page_tag", "duration")
//        },
//        {"data": "3", "sName": "nbExeUsefull", "sWidth": "40px", "title": doc.getDocOnline("tag", "nbexeusefull")},
//        {
//            "data": null,
//            "sName": "reliability",
//            "sWidth": "150px",
//            "mRender": function (data, type, obj) {
//                return reliability(obj[0]);
//            },
//            "title": doc.getDocOnline("page_tag", "reliability")
//        },
//        {
//            "data": null,
//            "sName": "exepermin",
//            "sWidth": "40px",
//            "mRender": function (data, type, obj) {
//                var dur = getDuration(obj[0]);
//                if (dur > 0) {
//                    return Math.round((obj[0].nbExe / dur) * 10) / 10;
//                }
//                return "exepermin";
//            },
//            "title": doc.getDocOnline("page_tag", "exepermin")
//        },
//        {"data": "2", "sName": "nbExe", "sWidth": "40px", "title": doc.getDocOnline("tag", "nbexe")},
//        {"data": "7", "sName": "ciscore", "sWidth": "40px", "title": doc.getDocOnline("tag", "ciscore")},
//        {"data": "5", "sName": "DateEndQueue", "sWidth": "150px", "title": doc.getDocOnline("tag", "dateendqueue")}
//    ];
//    return aoColumns;
//}
//
//function reliability(tag) {
//    if (tag.nbExe > 0) {
//        var per = (tag.nbExeUsefull / tag.nbExe) * 100;
//        var roundPercent = Math.round(per * 10) / 10;
//        var satcolor = getGreenToRed(per);
//        return "<div class=\"progress-bar\" role=\"progressbar\" style=\"width:" + per + "%; background-color: " + satcolor + "\">" + roundPercent + "%</div>";
//    } else {
//        return "";
//    }
//}
//function getGreenToRed(percent) {
//    r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
//    g = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
//    return 'rgb(' + r + ',' + g + ',0)';
//}
//function result(tag) {
//    var progress = "";
//    if (tag.nbExeUsefull > 0) {
//        progress += "<div class=\"progress-bar statusOK\" role=\"progressbar\" style=\"width:" + (tag.nbOK * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbOK * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusKO\" role=\"progressbar\" style=\"width:" + (tag.nbKO * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbKO * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusFA\" role=\"progressbar\" style=\"width:" + (tag.nbFA * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbFA * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusNA\" role=\"progressbar\" style=\"width:" + (tag.nbNA * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbNA * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusNE\" role=\"progressbar\" style=\"width:" + (tag.nbNE * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbNE * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusWE\" role=\"progressbar\" style=\"width:" + (tag.nbWE * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbWE * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusPE\" role=\"progressbar\" style=\"width:" + (tag.nbPE * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbPE * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusQU\" role=\"progressbar\" style=\"width:" + (tag.nbQU * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbQU * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusQE\" role=\"progressbar\" style=\"width:" + (tag.nbQE * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbQE * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//        progress += "<div class=\"progress-bar statusCA\" role=\"progressbar\" style=\"width:" + (tag.nbCA * 100 / tag.nbExeUsefull) + "%;\">" + Math.round((tag.nbCA * 100 / tag.nbExeUsefull) * 10) / 10 + "%</div>";
//    }
//    return progress;
//}
//function getDuration(tag) {
//    var startTime = new Date(tag.DateCreated);
//    var endTime = new Date(tag.DateEndQueue);
//    var diff = (endTime - startTime) / 60000;
//    var roundDiff = Math.round(diff * 10) / 10;
//    return (roundDiff);
//}
