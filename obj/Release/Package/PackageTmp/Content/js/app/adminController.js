(function (){
    var app = angular.module("app-category");
    app.controller("adminController", ["$scope", "$http", function ($scope, $http) {
        var userInfo;
        if (sessionStorage.email) {
            $scope.userLogged = true;
            $scope.userEmail = sessionStorage.email;
            $scope.userId = sessionStorage.ID;
            $scope.user = sessionStorage.User;
            angular.element('#logout').css("display", "inline-block");
            angular.element('.admin').css("display", "block");
            var userInfo = angular.fromJson(sessionStorage.userInfo);
            if (userInfo.Role != "Admin") {
                window.location.href = "/Home/Index";
            } else {
                $scope.users = [];

                $http.get("/api/getAllUsers").then(function (results) {
                    $scope.users = results.data;
                });
            }
        } else {
            window.location.href = "/Home/login";
        }

        $scope.roles = ["Admin", "User", "Editor"];

        $scope.save = function (item) {
            var msg ='User '+ item.Name + ' ' + item.Surname + ' will be updated !';
            bootbox.confirm(msg, function (result) {
                if (result) {
                    $http.post("/api/addUser", item).then(function (result) {
                        if (result.data == "Ok") {
                            bootbox.alert("User " + item.Name + ' ' + item.Surname + ' has been updated');
                        }
                    });
                }
            });
        }

        $scope.remove = function (item) {
            var msg ='User '+ item.Name + ' ' + item.Surname + ' will be removed !';
            bootbox.confirm(msg, function (result) {
                if (result) {
                    var index = $scope.users.indexOf(item);
                    $scope.users.splice(index, 1);
                    $http.post("/api/removeUser", item).then(function (result) {
                        if (result.data == "Ok") {
                            bootbox.alert("User " + item.Name + ' ' + item.Surname + ' has been removed');
                        }
                    });
                }
            });
        }

        $scope.addNew = function () {
            $scope.users.push({
                Name: "",
                Surname: "",
                Position: "",
                email: "",
                Role: "User"
            });
        }
        $scope.back = function () {
            window.history.back();
        };

    }])
})();