$(document).ready(function() {

    var booleanInfos = false;
    var booleanLiked = false;

    $(".sendbtn").css("cursor", "not-allowed");
    $(".sendbtn").css('background-color', "gray");
    $(".sendbtn").prop('disabled', true);
    $(".sendnewpdp").prop('disabled', true);

    $(".eyeimg").click(function() {

        if ($(".inputmdp").prop("type") == "password") {
            $(this).prop("src", "images/eyeslash2.png");
            $(".inputmdp").prop("type", "text");
        } else {
            $(this).prop("src", "images/eye2.png");
            $(".inputmdp").prop("type", "password");
        }

    });

    $(".grpchoice").click(function() {

        $(".sendnewpdp").prop('disabled', false);

        $("#av1").removeClass("imgselectedclass");
        $("#av2").removeClass("imgselectedclass");
        $("#av3").removeClass("imgselectedclass");
        $("#av4").removeClass("imgselectedclass");
        $("#av5").removeClass("imgselectedclass");
        $("#av6").removeClass("imgselectedclass");
        $("#av7").removeClass("imgselectedclass");
        $("#av8").removeClass("imgselectedclass");
        $("#av9").removeClass("imgselectedclass");
        $("#av10").removeClass("imgselectedclass");
        $("#av11").removeClass("imgselectedclass");
        $("#av12").removeClass("imgselectedclass");
        $("#av13").removeClass("imgselectedclass");
        $("#av14").removeClass("imgselectedclass");

        $(this).addClass("imgselectedclass");



    });

    $(".cancelimg1").click(function() {
        $(".posts , .loginspace , .navbar").removeClass("disablecontent");
    });

    $(".cancelimg2").click(function() {
        $(".posts , .loginspace , .navbar").removeClass("disablecontent");
    });

    $(".sendbtn").click(function() {
        $(".limitnb").text(1000);
        $(this).css("cursor", "not-allowed");
        $(this).css('background-color', "gray");
        $(this).prop('disabled', true);
    });

    $(".limitnb").text(1000);

    $(".msginput").keypress(function(e) {
        var txtvalue = $(".msginput").val()
        var size = txtvalue.length + 1;

        if ((1000 - size) >= 0) {
            $(".limitnb").css("color", "black");
            $(".sendbtn").prop('disabled', false);
            $(".sendbtn").css('background-color', "lightskyblue");
            $(".sendbtn").css('cursor', "pointer");
        }

        if ((1000 - size) < 00) {
            $(".limitnb").css("color", "red");
            $(".sendbtn").prop('disabled', true);
            $(".sendbtn").css('background-color', "gray");
            $(".sendbtn").css('cursor', "not-allowed");
        }

        $(".limitnb").text(1000 - size);

        if ($(".limitnb").text() == 1000) {
            $(".sendbtn").css('background-color', "gray");
            $(".sendbtn").css('cursor', "not-allowed");
            $(".sendbtn").prop('disabled', true);
        }
    });

    $(".msginput").keyup(function(e) {
        var txtvalue = $(".msginput").val()
        var size = txtvalue.length;

        if ((1000 - size) >= 0) {
            $(".limitnb").css("color", "black");
            $(".sendbtn").prop('disabled', false);
            $(".sendbtn").prop('title', "Envoi");
            $(".sendbtn").css('background-color', "lightskyblue");
            $(".sendbtn").css('cursor', "pointer");
        }

        if ((1000 - size) < 0) {
            $(".limitnb").css("color", "red");
            $(".sendbtn").prop('disabled', true);
            $(".sendbtn").prop('title', "Too many characters");
            $(".sendbtn").css('background-color', "gray");
            $(".sendbtn").css('cursor', "not-allowed");
        }

        $(".limitnb").text(1000 - size);

        if ($(".limitnb").text() == 1000) {
            $(".sendbtn").css('background-color', "gray");
            $(".sendbtn").css('cursor', "not-allowed");
            $(".sendbtn").prop('disabled', true);
        }
    });
});