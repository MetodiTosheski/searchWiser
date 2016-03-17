(function () {
    "use strict";
    $(".savedMessage").hide();
    if (sessionStorage.User) {
        $("#user").text(sessionStorage.User);
    }
    $("#logout").click(function () {
        sessionStorage.removeItem("email");
        window.location.href = "/home/login";
    });

    $("#profileView").click(function () {
        window.location.href = "/home/profile";
    });

    $("#profileView2").click(function () {
        window.location.href = "/home/profile";
    });
    
    $("#addSynonymSkills").click(function () {
        $("#showSynonymSkills").toggle("blind", 500);
    });

    $("#addSynonymJobTittles").click(function () {
        $("#showSynonymJobTittles").toggle("blind", 500);
    });

    $("#addSynonymEducation").click(function () {
        $("#showSynonymEducation").toggle("blind", 500);
    });

    $("#addSynonymCertification").click(function () {
        $("#showSynonymCertification").toggle("blind", 500);
    });

    $("#addSearchStringSkills").click(function () {
        $("#showSearchStringSkills").toggle("blind", 500);
    });

    $("#addSearchStringJobTittles").click(function () {
        $("#showSearchStringJobTittles").toggle("blind", 500);
    });

    $("#addSearchStringEducation").click(function () {
        $("#showSearchStringEducation").toggle("blind", 500);
    });

    $("#addSearchStringCertification").click(function () {
        $("#showSearchStringCertification").toggle("blind", 500);
    });

    setTimeout(function () {
        $('#splash').fadeOut('slow');
        $('.container').show().animate();
    }, 2000);

    var appUser = angular.module("app-user");
    appUser.controller("UserController", ["$scope", function ($scope) {
       if (sessionStorage.email) {
            $scope.userLogged = true;
            $scope.userEmail = sessionStorage.email;
            $scope.userId = sessionStorage.ID;
            $scope.user = sessionStorage.User;       
        } else {
            window.location.href = "/Home/login"
        }
    }]);
    var app = angular.module("app-category");
        app.controller("CategoryController", ["$scope","$http", function ($scope, $http) { 
            $scope.typeClicked = false;
            $scope.categorySelected = false;
            $scope.tags;
            $scope.showType;
            $scope.listResults = [];
            $scope.value = "public";
            $scope.advancedPanel = false;
            $scope.newSynonymAvailable = false;
            $scope.newSearchStringAvailable = false;
            $scope.searchNotFound = true;
            var privateFetched = false;
            var publicFetched = false;
            var autocompletePrivateSource;
            var autocompletePublicSource;
            var selectedId;
            var selectedSearchType;
            var dataWordsList = [];
            var dataWords = []
            var dataSearchStringsList = [];
            var dataSearchStrings = [];

            if (sessionStorage.email) {
                 $scope.userLogged = true;
                 $scope.userEmail = sessionStorage.email;
                 $scope.userId = sessionStorage.ID;
                 $scope.user = sessionStorage.User;
                 angular.element('#logout').css("display", "inline-block");
             } else {
                 window.location.href = "/Home/login"
            }

            $scope.data = [];

            function getAllData() {
                var dataList = [];
                var wholeData = [];
                if (!publicFetched) {
                    $http.get("/api/dataWords").then(function (results) {
                        dataWords = results.data;
                        angular.forEach(results.data, function (data) {
                            dataWordsList.push({
                                valueW: data.ID,
                                label: data.Word
                            });
                        });

                        $http.get("/api/dataSearchStrings").then(function (results) {
                            dataSearchStrings = results.data;
                            angular.forEach(results.data, function (data) {
                                dataSearchStringsList.push({
                                    valueS: data.ID,
                                    label: data.SearchString
                                });
                            });
                            publicFetched = true;
                            autocompletePublicSource = dataList;
                            dataList = dataWordsList.concat(dataSearchStringsList);
                            wholeData = dataWords.concat(dataSearchStrings);
                            $scope.data = dataList;
                           autoComplete(dataList, wholeData);
                        });
                    });
                }
            }

            function autoComplete(dataList, wholeData) {
                $(".search-field").autocomplete({
                    source: dataList,
                    select: function (event, ui) {
                        if (ui.item.valueS) {
                            selectedSearchType = "searchStrings";
                            selectedId = ui.item.valueS;
                           // searchReasult(selectedSearchType, selectedId, dataSearchStrings);
                        }
                        else if (ui.item.valueW) {
                            selectedSearchType = "synonyms"
                            selectedId = ui.item.valueW;
                           // searchReasult(selectedSearchType, selectedId, dataWords);
                        }
                        searchReasult(selectedSearchType, selectedId, wholeData);
                        //return false;
                    },
                    response: function(event, ui) {
                                if (!ui.content.length) {
                                    var noResult = { value: "", label: "No results found click on the plus sign to add" };
                                    //alert($scope.searchInput);
                                    ui.content.push(noResult);                         
                                    //$("#message").text("No results found");
                                } else {
                                    $("#message").empty();
                                }
                            }      
                });
            }

            /*function getAllPrivateData() {
                var dataList = [];
                if (!privateFetched) {
                    $http.get("/api/categories/GetUserWords?userid=" + sessionStorage.ID).then(function (results) {
                        dataWords = results.data;
                        angular.forEach(dataWords, function (data) {
                            dataWordsList.push({
                                valueW: data.ID,
                                label: data.Word
                            });
                        });
                        $http.get("/api/categories/GetUserSearchStrings?userid=" + sessionStorage.ID).then(function (results) {
                            dataSearchStrings = results.data;
                            angular.forEach(results.data, function (data) {
                                dataSearchStringsList.push({
                                    valueS: data.ID,
                                    label: data.SearchString
                                });
                            });
                            privateFetched = true;
                            autocompletePrivateSource = dataList;
                            dataList = dataWordsList.concat(dataSearchStringsList);
                            $scope.data = dataList;
                           // autoComplete(dataList, selectedSearchType, selectedId, dataWords, dataSearchStrings)
                        });
                    });
                }
            }*/

         //   getAllPrivateData();
            getAllData();

            $scope.radioChange = function (value) {
              /*  if (value == "private") {
                    autoComplete(autocompletePrivateSource, dataWords, dataSearchStrings);
                }
                else if (value == "public") {
                    autoComplete(autocompletePublicSource, dataWords, dataSearchStrings);
                }*/
            };

            function searchReasult(selectedSearchType, selectedId, data) {
                var groupID;
                var listReturn = [];
                $scope.listJobTittles = [];
                $scope.listSkills = [];
                $scope.listEducation = [];
                $scope.listCertification = [];
                if (selectedSearchType == "synonyms") {
                    $scope.showType = true;
                    angular.forEach(data, function (item) {
                        if (item.ID === selectedId) {
                            if (item.WordsGroup) {
                                groupID = item.WordsGroup;
                                sessionStorage.GroupID = groupID;
                                sessionStorage.CategoryID = item.CategoryID;
                            }
                        }
                    });
                    angular.forEach(data, function (item) {
                        if (item.WordsGroup == groupID) {
                            listReturn.push(item);
                        }
                        else if (item.SearchStringGroupID == groupID) {
                            listReturn.push(item);
                        }
                    });
                }
                if (selectedSearchType == "searchStrings") {
                    angular.forEach(data, function (item) {
                        if (item.ID === selectedId) {
                            if (item.SearchStringGroupID) {
                                groupID = item.SearchStringGroupID;
                            }
                        }
                    });
                    angular.forEach(data, function (item) {
                        if (item.SearchStringGroupID == groupID) {
                            listReturn.push(item);
                        }
                        else if (item.WordsGroup == groupID) {
                            listReturn.push(item);
                        }
                    });
                }
                $scope.searchResultsAvailable = true;
                $scope.showType = true;
                
                angular.forEach(listReturn, function (item) {
                    if (item.CategoryID === "1") {
                        $scope.listJobTittles.push(item);
                    }
                    else if (item.CategoryID === "2") {
                        $scope.listSkills.push(item);
                    }
                    else if (item.CategoryID === "3") {
                        $scope.listCertification.push(item);
                    }
                    else if (item.CategoryID === "4") {
                        $scope.listEducation.push(item);
                    }
                });
               // $scope.listResults = listReturn;
            }

            $scope.activateAdvanced = function () {
                $scope.wordNotFound = false;
                $('.additionalSettings').fadeIn();
            }

            $scope.closeAdvanced = function () {
                $('.additionalSettings').fadeOut();
                $scope.searchInput = ''
                $scope.selected_category = '';
                $scope.selectedType = '';
                $('.img' + previousClicked).parent().removeClass('selectedImg');
                $(".additionalSettings").fadeOut();
                $("#btnSynonyms").removeClass("btnSelected");
                $("#btnSearchStrings").removeClass("btnSelected");
            };

            function parseString(string) {
                var listStrings = string.split(";");
                return listStrings;
            }

            function addStrings(type) {
                var list = parseString($scope.newSearchString);
                var category;

                switch (type) {
                    case ('skills'):
                        category = "2";
                        break;
                    case ('jobtitles'):
                        category = "1";
                        break;
                    case ('certification'):
                        category = "3";
                        break;
                    case ('education'):
                        category = "4";
                        break;
                };

                angular.forEach(list, function (str) {
                    add(str, category);
                });

                function add(string, category) {
                    var data = {
                        SearchString: string,
                        CategoryId: category,
                        SearchStringGroupID: sessionStorage.GroupID,
                        Available: false,
                        PostedBy: sessionStorage.ID
                    };
                    $http.post("/api/AddSearchString", data).then(function (result) {
                        if (result.data == "OK") {
                            $(".savedMessage").show().delay(3000).fadeOut();
                            $scope.newSearchString = '';
                        }
                    });
                }
            }

            function addSynonyms(type) {
                var list = parseString($scope.newSynonym);
                var category;
 
                switch (type) {
                    case ('skills'):
                        category = "2";
                        break;
                    case ('jobtitles'):
                        category = "1";
                        break;
                    case ('certification'):
                        category = "3";
                        break;
                    case ('education'):
                        category = "4";
                        break;
                };

                angular.forEach(list, function (str) {
                    add(str, category);
                });

                function add(string, category) {
                    var data = {
                        Word: string,
                        CategoryId: category,
                        WordsGroup: sessionStorage.GroupID,
                        Available: false,
                        PostedBy : sessionStorage.ID
                    };
                    $http.post("/api/AddWord", data).then(function (result) {
                        if (result.data == "OK") {
                            $(".savedMessage").show().delay(3000).fadeOut();
                            $scope.newSynonym = '';
                        }
                    });
                }
            }
            $scope.insertNewGroup = function () {
                $('.additionalSettings').fadeIn();
                $scope.wordNotFound = true;
                $('.additionalSettings').animate({ bottom: '100px ' });
            }
            $scope.errorMessageTypeShow = false;
            $scope.errorMessageCategoryShow = false;
            function insertnew(data) {
                var item = {
                    Word: data.Word,
                    CategoryID: data.CategoryID,
                    WordsGroup: null,
                    Available: data.Available,
                    PostedBy: data.PostedBy
                }        
            }

            $scope.addNewWord = function () {
                var interval;
                var category;
                if ($scope.selectedType) {
                    clearInterval(interval);
                    $scope.errorMessageTypeShow = false;
                    if ($scope.selected_category) {
                        switch ($scope.selected_category) {
                            case (2):
                                category = "skills";
                                break;
                            case (1):
                                category = 'jobtitles';
                                break;
                            case (3):
                                category = 'certification';
                                break;
                            case (4):
                                category = 'education';
                                break;
                        };
                        clearInterval(interval);
                        $scope.errorMessageCategoryShow = false;
                        var item = {
                            Word: $scope.searchInput,
                            CategoryID: $scope.selected_category,
                            WordsGroup: null,
                            Available: false,
                            PostedBy: 1
                        }
                        if ($scope.selectedType === 'synonyms') {
                            var msg = "Are you sure? Your input: "+ $scope.searchInput + " should be added into " + $scope.selectedType +" type and "+ category +" category !";
                            bootbox.confirm(msg, function (result) {
                                if (result) {
                                    $http.post("/api/AddWord", item).then(function (result) {
                                        if (result.data == "OK") {
                                            bootbox.alert("Your request has been saved successfully. Our editors will make reveiw in next few hours and give you feedback. The application is wiser now. Thanks :)")
                                            $scope.searchInput = ''
                                            $scope.selected_category = '';
                                            $scope.selectedType = '';
                                            $('.img' + previousClicked).parent().removeClass('selectedImg');
                                            $(".additionalSettings").fadeOut();
                                            $("#btnSynonyms").removeClass("btnSelected");
                                        }
                                    });
                                }
                            });
                           
                        } else {
                            delete item.WordsGroup;
                            delete item.Word;
                            item.SearchString = $scope.searchInput;
                            item.SearchStringGroupID = null;
                            var msg = "Are you sure? Your input: "+ $scope.searchInput + " should be added into " + $scope.selectedType +" type and "+ category +" category !";
                            bootbox.confirm(msg, function (result) {
                                $http.post("/api/AddSearchString", item).then(function (result) {
                                    if (result.data == "OK") {
                                        bootbox.alert("Your request has been saved successfully. Our editors will make reveiw in next few hours and give you feedback. The application is wiser now. Thanks :)")
                                        $scope.searchInput = ''
                                        $scope.selected_category = '';
                                        $scope.selectedType = '';
                                        $('.img' + previousClicked).parent().removeClass('selectedImg');
                                        $(".additionalSettings").fadeOut();
                                        $("#btnSearchStrings").removeClass("btnSelected");
                                    }
                                });
                            });
                        }
                    } else {
                        $scope.errorMessageCategoryShow = true;
                        errorAnimation();
                        interval = setInterval(function () {
                            errorAnimation();
                        }, 1000);
                    }
                } else {              
                    $scope.errorMessageTypeShow = true;
                    errorAnimation();
                    interval = setInterval(function () {
                        errorAnimation();
                    }, 1000);
                }
            }

            function errorAnimation() {
                $(".glyphicon-chevron-left").animate({ "left": "+=15px" }, "slow");
                $(".glyphicon-chevron-left").animate({ "left": "-=15px" }, "slow");
            }

            $http.get("/api/categories")
                .then(function (results) {
                    $scope.categories = results.data;
                    $scope.selected_category = $scope.categories[0].Description;
                });

            $scope.find = function () {
                $scope.typeClicked = false;
                $scope.categorySelected = false;
                $scope.searchResultsAvailable = false;
            };

            $scope.type = function (type) {
                $scope.errorMessageTypeShow = false;
                angular.element("#type").css("display", "block");
                if (previousClicked) {
                    $('.img' + previousClicked).removeClass('selectedImg');
                }

               // $scope.typeClicked = true
                $scope.categorySelected = false;
                $scope.selected_category = '';
                $scope.selectedType = type;
                $scope.searchResultsAvailable = false;
                $scope.searchResults = [];
                if (type === 'synonyms') {
                    $("#btnSearchStrings").removeClass("btnSelected");
                    $("#btnSynonyms").addClass("btnSelected");
                }
                else if (type === "searchStrings") {
                    $("#btnSearchStrings").addClass("btnSelected");
                    $("#btnSynonyms").removeClass("btnSelected");
                }

            };
                
            var previousClicked;
            $scope.selectCategory = function (category) {
                $scope.tags = [];
                $scope.errorMessageCategoryShow = false;
                angular.element("#category").css("display", "block");

                if (previousClicked) {
                    $('.img' + previousClicked).parent().removeClass('selectedImg');
                }
                $('.img' + category).parent().addClass('selectedImg');

                previousClicked = category;
                $scope.searchResultsAvailable = false;
                $scope.searchResults = [];
                $scope.selected_category = category;
                if (category) {
                    $scope.categorySelected = true;
                    $scope.searchResultsAvailable = false;
                }
                if ($scope.selectedType == "synonyms") {
                    $scope.showType = true;
                    $http.get("/api/categories/GetWords?category=" + category)
                    .then(function (results) {
                        var availableTags = [];
                        $scope.tags = results.data
                    });
                }

                else if ($scope.selectedType == "searchStrings") {
                    $scope.showType = false;
                    $http.get("/api/categories/GetSearchStrings?category=" + category)
                  .then(function (results) {
                      var availableTags = [];
                      $scope.tags = results.data
                  });
                }
            };

            $scope.showSynonym = function () {
                $scope.newSynonymAvailable = true;
            }
            
            $scope.showSearchStrings = function () {
                $scope.newSearchStringAvailable = true;
            }

            $scope.addSynonym = function (type) {
                addSynonyms(type);
            }

            $scope.addSearchString = function (type) {
                addStrings(type);
            }
            $scope.searchRes;
            $scope.search = function () {
                searchNow($scope.selectedType, $scope.selectedTag);
            };

            function searchNow(type, groupId) {
                $scope.listJobTittles = [];
                $scope.listSkills = [];
                $scope.listCertification = [];
                $scope.listEducation = [];
                if (type == "synonyms") {
                    angular.element("#searchResultsAvailable").css("display", "block");
                    $scope.searchResults = [];
                    $http.get("/api/categories/GetSimilarWords?category=" + $scope.selected_category + "&group=" + groupId)
                     .then(function (results) {
                         switch ($scope.selected_category) {
                             case (1):
                                 $scope.listJobTittles = results.data;
                                 break;
                             case (2):
                                 $scope.listSkills = results.data;
                                 break;
                             case (3):
                                 $scope.listCertification = results.data;
                                 break;
                             case (4):
                                 $scope.listEducation = results.data;
                                 break;
                         }
                         $scope.searchResultsAvailable = true;
                     });
                }

                if (type == "searchStrings") {
                    $scope.searchResults = [];
                    angular.element("#searchResultsAvailable").css("display", "block");
                    $http.get("/api/categories/GetSimilarSearchStrings?category=" + $scope.selected_category + "&group=" + groupId)
                     .then(function (results) {
                         switch ($scope.selected_category) {
                             case (1):
                                 $scope.listJobTittles = results.data;
                                 break;
                             case (2):
                                 $scope.listSkills = results.data;
                                 break;
                             case (3):
                                 $scope.listCertification = results.data;
                                 break;
                             case (4):
                                 $scope.listEducation = results.data;
                                 break;
                         }
                         $scope.searchResultsAvailable = true;
                     });
                }
            }

            $scope.linkedinSearch = function (list,type,category) {
                var searchString = "("
                if (type == 'synonyms') {
                    var listSyn = [];
                    angular.forEach(list, function (item) {
                        if (item.Word) {
                            listSyn.push(item);
                        }
                    });
                    var size = listSyn.length - 1;
                    var i = 0;
                    angular.forEach(listSyn, function (str) {
                        if (i == size) {
                                searchString += '"' + str.Word + '"';
                        } else {
                                searchString += '"' + str.Word + '"' + ' OR ';
                        }
                        i++;
                    });
                    searchString += ")";
                    window.open("https://www.linkedin.com/vsearch/p?"+category+"=" + searchString + "&openAdvancedForm=true", '_blank');
                }
                if (type == 'SearchStrings') {
                    var listStr = [];
                    angular.forEach(list, function (item) {
                        if (item.SearchString) {
                            listStr.push(item);
                        }
                    });
                    var size = listStr.length - 1;
                    var i = 0;
                    angular.forEach(listStr, function (str) {
                        if (i == size) {
                            searchString += '"' + str.SearchString + '"';
                        } else {
                            searchString += '"' + str.SearchString + '"' + ' OR ';
                        }
                        i++;
                    });
                    searchString += ")";
                    window.open("https://www.linkedin.com/vsearch/p?" + category + "=" + searchString + "&openAdvancedForm=true", '_blank');
                }
            }
        }]);
})();