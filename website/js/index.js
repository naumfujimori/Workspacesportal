/*global Dashboard _config*/

var Dashboard = window.Dashboard || {};
var authToken;

(function ($) {

    var WORKSPACES_CONTROL_URL = _config.api.invokeUrl + '/workspaces-control';

    Dashboard.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });

    $("#methodStatus").hide();
    $("#DesktopNoExist").hide();
    $("#DesktopExist").hide();

    $(function onDocReady() {

        $('#RequestWorkSpace').submit(handleRequest);
        $('#DecommissionWorkSpace').submit(handleDecommission);
        $('#RebootWorkSpace').submit(handleReboot);
        $('#RebuildWorkSpace').submit(handleRebuild);

        $("#reloadButton").on('click', function() {
            location.reload();
        });

    });

    function handleRequest(event) {
        event.preventDefault();

        // TODO: Add logic to grab the username from requestContext.authorizer.email or .cognito:username and set that 
        //  to the SelfServiceManaged tag key's value of the WorkSpace. This tag can then be used to validate any 
        //  operations like reboot/rebuild/decom later. 
        //  We have to do this because querying SimpleAD through awscli isn't available, so querying values to verify would
        //  require a separate manually created DS API. We need to do some matching to avoid users interacting with other users machines.

        var username = $('#reqUsername').val();
        var bundle = $('#reqBundle').val();


        $.ajax({
            method: 'POST',
            url: WORKSPACES_CONTROL_URL,
            headers: {
                Authorization: authToken
            },
            beforeSend: function () {
                //$('#loading-image').show();
                console.log("URL: " + WORKSPACES_CONTROL_URL);
                console.log("Token: " + authToken);
                console.log("json: " + JSON.stringify({
                    action: 'create',
                    username: username,
                    bundle: bundle
                }));
            },
            complete: function () {
                //$('#loading-image').hide();
            },
            data: JSON.stringify({
                action: 'create',
                username: username,
                bundle: bundle
            }),
            contentType: 'text/plain',
            error: function () {
                $("#methodStatus").addClass("alert-danger");
                $("#methodStatus").html("<b>Error! Something went wrong... Please contact an administrator if the problem persists.")
                $("#methodStatus").show();
            },
            success: function (data) {
                $("#methodStatus").addClass("alert-success");
                $("#methodStatus").html("<b>Success! WorkSpace creation in-progress...</b> Please allow up to 30 minutes for the virtual desktop to be provisioned. Once complete, an email will be sent with instructions.")
                $("#methodStatus").show();
            }
        });

    }

    function handleReboot(event) {
        event.preventDefault();

        $.ajax({
            method: 'POST',
            url: WORKSPACES_CONTROL_URL,
            headers: {
                Authorization: authToken
            },
            beforeSend: function () {
                //$('#loading-image').show();
                console.log("json: " + JSON.stringify({
                    action: 'reboot'
                }));
            },
            complete: function () {
                //$('#loading-image').hide();
            },
            data: JSON.stringify({
                action: 'reboot'
            }),
            contentType: 'text/plain',
            error: function () {
                $("#methodStatus").addClass("alert-danger");
                $("#methodStatus").html("<b>Error! Something went wrong... Please contact an administrator if the problem persists.")
                $("#methodStatus").show();
            },
            success: function (data) {
                $("#methodStatus").addClass("alert-success");
                $("#methodStatus").html("<b>Success! WorkSpace reboot in-progress...</b> Please allow up to 5 minutes for the virtual desktop to be fully rebooted.")
                $("#methodStatus").show();
                setTimeout(function () {
                    location.reload();
                }, 60000);
            }
        });

    }

    function handleRebuild(event) {
        event.preventDefault();
        
        $.ajax({
            method: 'POST',
            url: WORKSPACES_CONTROL_URL,
            headers: {
                Authorization: authToken
            },
            beforeSend: function () {
                //$('#loading-image').show();
                console.log("json: " + JSON.stringify({
                    action: 'rebuild'
                }));
            },
            complete: function () {
                //$('#loading-image').hide();
            },
            data: JSON.stringify({
                action: 'rebuild'
            }),
            contentType: 'text/plain',
            error: function () {
                $("#methodStatus").addClass("alert-danger");
                $("#methodStatus").html("<b>Error! Something went wrong... Please contact an administrator if the problem persists.")
                $("#methodStatus").show();
            },
            success: function (data) {
                $("#methodStatus").addClass("alert-success");
                $("#methodStatus").html("<b>Success! WorkSpace rebuild in-progress...</b> Please allow up to 10 minutes for the virtual desktop to be fully rebuilt. Once complete, an email will be sent with details.")
                $("#methodStatus").show();
                setTimeout(function () {
                    location.reload();
                }, 60000);
            }
        });

    }

    function handleDecommission(event) {
        event.preventDefault();

        // TODO: Add logic to grab the username from requestContext.authorizer.email or .cognito:username and verify match 
        //  against the SelfServiceManaged tag's value of the WorkSpace before allowing to proceed. If WorkSpace wasn't created 
        //  through SSP then we won't interact with it.

        $.ajax({
            method: 'POST',
            url: WORKSPACES_CONTROL_URL,
            headers: {
                Authorization: authToken
            },
            beforeSend: function () {
                //$('#loading-image').show();
                console.log("URL: " + WORKSPACES_CONTROL_URL);
                console.log("Token: " + authToken);
                console.log("json: " + JSON.stringify({
                    action: 'delete'
                }));
            },
            complete: function () {
                //$('#loading-image').hide();
            },
            data: JSON.stringify({
                action: 'delete'
            }),
            contentType: 'text/plain',
            error: function () {
                $("#methodStatus").addClass("alert-danger");
                $("#methodStatus").html("<b>Error! Something went wrong... Please contact an administrator if the problem persists.")
                $("#methodStatus").show();
            },
            success: function (data) {
                $("#methodStatus").addClass("alert-success");
                $("#methodStatus").html("<b>Success! WorkSpace removal in-progress...</b> Please allow up to 10 minutes for the virtual desktop to be fully removed.")
                $("#methodStatus").show();
                setTimeout(function () {
                    location.reload();
                }, 60000);
            }
        });
    }

    $(function init() {
        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }

        $.ajax({
            method: 'POST',
            url: WORKSPACES_CONTROL_URL,
            headers: {
                Authorization: authToken
            },
            beforeSend: function () {
                //$('#loading-image').show();
                console.log("json: " + JSON.stringify({
                    action: 'list'
                }));
            },
            complete: function () {
                //$('#loading-image').hide();
            },
            data: JSON.stringify({
                action: 'list'
            }),
            contentType: 'text/plain',
            error: function () {

                $("#DesktopNoExist").show();
            },
            success: function (data) {
                $("#workspace-Id").html(data.WorkspaceId);
                $("#workspace-Username").html(data.UserName);
                $("#workspace-State").html(data.State);
                $("#workspace-Bundle").html(data.BundleId);
                $("#DesktopExist").show();
            }
        });
    });

}(jQuery));