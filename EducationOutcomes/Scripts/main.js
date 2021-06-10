var uri = 'api/Outcomes';
mySchoolArray = [];

//$(document).ready(function () {
//    fetch(uri).then(function (response) {
//        if (response.ok) {
//            return response.json();
//        } else {
//            return Promise.reject(response);
//        }

//    }).then(function (schoolList) {
//        console.log(schoolList);
//        mySchoolArray = schoolList;
//        $.each(schoolList, function (key, item) {
//            $('#select-school').append
//                ($('<option></option').val(item.SchoolId).html(item.School1));
//        });
//    })
//})

//GetSchools = () => {
//    $('#school-list').empty();
//    let schoolValue = $('#select-school').val();
//    console.log(schoolValue);
//    fetch(uri + '/getDistrictPercentage?schoolID=' + schoolValue).then(function (response) {
//        if (response.ok) {
//            return response.json();
//        } else {
//            return Promise.reject(response);
//        }
//    }).then((percentageData) => {
//        console.log(percentageData);
//        $('#school-list').append(percentageData[0].School1 + " students have a poverty percentage of: " + percentageData[0].PovPercent);
//    })
//}


////Function to populate district drop down
$(function () {
    $.ajax({
        type: "GET",
        url: 'api/Outcomes/district',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            $.each(r, function (key, district) {
                $('#district').append($('<option></option>').val(district.$id).html(district.DistrictName));
            });
        }
    });
});


////Function to populate Socio drop down
$(function () {
    $.ajax({
        type: "GET",
        url: 'api/Outcomes/socio',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            $.each(r, function (key, socio) {
                $('#socio1').append($('<option></option>').val(socio.$id).html(socio.SocioeconomicStatus));
            });
        }
    });
});

////Function to populate socio drop down
$(function () {
    $.ajax({
        type: "GET",
        url: 'api/Outcomes/grades',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            $.each(r, function (key, grade) {
                $('#grade').append($('<option></option>').val(grade.$id).html(grade.Grade1));
            });
        }
    });
});


////Function to populate subject drop down
$(function () {
    $.ajax({
        type: "GET",
        url: 'api/Outcomes/subject',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            $.each(r, function (key, subject) {
                $('#subject').append($('<option></option>').val(subject.$id).html(subject.SubjectName));
            });
        }
    });
});

///Populate Title drop Down

$(function () {
    $.ajax({
        type: "GET",
        url: 'api/Outcomes/title',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            $.each(r, function (key, title) {
                $('#title').append($('<option></option>').val(title.$id).html(title.TitleName));
            });
        }
    });
});

////Function to populate school drop down
$(function () {
    $.ajax({
        type: "GET",
        url: 'api/Outcomes/school',
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (r) {
            console.log(r)
            $.each(r, function (key, school) {
                $('#school').append($('<option></option>').val(school.$id).html(school.School1));
            });
        }
    });
});


function GetPovList() {

    var select = document.querySelector("#school");
    var select2 = document.querySelector("#socio1");
    var id = select.options[select.selectedIndex].text;
    var id2 = select2.options[select2.selectedIndex].text;
    console.log(id);

    $.ajax({
        url: 'api/Outcomes/provSchool?id=' + id + '&id2=' + id2,
        data: "",
        type: "GET",
        dataType: "json",
        success: function (povCount) {
            PovListSuccess(povCount);
            console.log(povCount);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function PovListSuccess(pov) {
    // Iterate over the collection of data
    $.each(pov, function (index, pov) {
        // Add a row to the Order Detail table
        PovAddRow(pov);
        console.log(pov);
    });
}

function PovAddRow(pov) {
    // Check if <tbody> tag exists, add one if not
    if ($("#PovTable tbody").length == 0) {
        $("#PovTable").append("<tbody></tbody>");
        console.log(pov);
    }
    // Append row to <table>
    $("#PovTable tbody").append(
        PovBuildTableRow(pov));
}

function PovBuildTableRow(pov) {
    var ret =
        "<tr>" +
        "<td>" + pov.DistrictName + "</td>" +
        "<td>" + pov.School1 + "</td>" +
        "<td>" + pov.SocioeconomicStatus + "</td>" +
        "<td>" + pov.PovPercent + "</td>" +
        "<td>" + pov.GraduationRate1 + "</td>" +
        "<td>" + pov.TestResults + "</td>" +
        //"<td>" + pov. + "</td>" +
        "</td>"
    "</tr>";
    return ret;
}

//function GetPovList() {

//    var select = document.querySelector("#school");
//    //var select2 = document.querySelector("#grade");
//    var id = select.options[select.selectedIndex].text;
//    //var id2 = select2.options[select2.selectedIndex].text;
//    console.log(id);

//    $.ajax({
//        url: 'api/Outcomes/provSchool?id=' + id ,//+ '&id2=' + id2,
//        data: "",
//        type: "GET",
//        dataType: "json",
//        success: function (pov) {
//            console.log(pov);
//            PovListSuccess(pov);
//            console.log(pov);
//        },
//        error: function (request, message, error) {
//            handleException(request, message, error);
//        }
//    });
//}

//function PovListSuccess(pov) {
//    // Iterate over the collection of data
//    $.each(pov, function (index, pov) {
//        // Add a row to the Order Detail table
//        PovAddRow(pov);
//        console.log(pov);
//    });
//}

//function PovAddRow(pov) {
//    // Check if <tbody> tag exists, add one if not
//    if ($("#PovTable tbody").length == 0) {
//        $("$PovTable").append("<tbody></tbody>");
//        console.log(pov);
//    }
//    // Append row to <table>
//    $("#PovTable tbody").append(
//        PovBuildTableRow(pov));
//}

//function PovBuildTableRow(pov) {
//    var ret =
//        "<tr>" +
//        "<td>" + pov.School1 + "</td>" +
//        "<td>" + pov.SocioeconomicStatus + "</td>" +
//        "<td>" + pov.SubjectName + "</td>" +
//        "<td>" + pov.DistrictName + "</td>" +
//        "<td>" + pov.Grade1 + "</td>" +
//        "<td>" + pov.PovPercent + "</td>" +
//        "</td>"
//    "</tr>";
//    return ret;
//}