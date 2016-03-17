(function () {
    angular.module("app-category", []);
    angular.module("app-user", []);
    if (window.location.pathname == "/Home/login" || window.location.pathname == "/home/login" || window.location.pathname == "/") {
        angular.element(".navbar").css("display", "none");
    }

    $("#btnAdmin").click(function () {
        window.location.href = "/home/admin";
    });
    $("#btnAdmin2").click(function () {
        window.location.href = "/home/admin";
    });
    if(sessionStorage.userInfo) {
        var userInfo = angular.fromJson(sessionStorage.userInfo);
        var stars;
        if (userInfo.Role !== "Admin") {
            $("#btnAdmin").css("display", "none");
            $("#btnAdmin2").css("display", "none");
        }

        $.get("/api/getUsers?email=" + sessionStorage.email).then(function (result) {
            userInfo = result[0];
            stars = Math.floor(userInfo.Points / 20);
            $('.numPoints').text(userInfo.Points);
            for (var i = 1; i <= 5; i++) {
                var element = '<span id=star' + i + '>&#9734;</span>';
                $(".numStars").append(element);
            }
            for (var i = 1; i <= 5; i++) {
                var element = '<span id=profStar' + i + '>&#9734;</span>';
                $(".profStars").append(element);
            }

            for (var i = 0; i < stars; i++) {
                var num = i + 1;
                $("#star" + num).addClass("rating");
            }
            for (var i = 0; i < stars; i++) {
                var num = i + 1;
                $("#profStar" + num).addClass("rating");
            }
        });
    }
    $(".navmenu-brand").text(sessionStorage.User);

    $('.searchBtn').click(function () {
        $('.search-control').animate({ bottom: '100px' });
        $('#searchResultsAvailable').animate({ bottom: '100px' });
        $('.additionalSettings').animate({ bottom: '100px ' });
    });
})();