var uri = 'api/Outcomes';

let mySchoolArray = [];
let ctxBarChart = document.getElementById('myBarChart').getContext('2d');
let ctxPieChart = document.getElementById('myPieChart').getContext('2d');
let myBarChart;
let myPieChart;
let perfArraySchool = [];
let perfArrayGrade = [];

//Website for chartjs https://www.chartjs.org/docs/master/

$(document).ready(function () {
    fetch(uri).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }

    }).then(function (schoolList) {
        console.log(schoolList);
        mySchoolArray = schoolList;
        $.each(schoolList, function (key, item) {
            $('#select-school').append
                ($('<option></option').val(item.SchoolId).html(item.School1));
        });
    })
})

GetSchools = () => {
    $('#school-list').empty();
    let schoolValue = $('#select-school').val();
    console.log(schoolValue);
    fetch(uri + '/getDistrictPercentage?schoolID=' + schoolValue).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then((percentageData) => {
        console.log(percentageData);
        $('#school-list').append(percentageData[0].School1 + " students have a poverty percentage of: " + percentageData[0].PovPercent);
        DrawPieChart(percentageData[0].School1, percentageData[0].PovPercent)
    })
}

GetSchoolPerformance = () => {
    var radioValue = $("input[name='performance']:checked").val();
    console.log(radioValue);
    fetch(uri + '/getSchoolPerformance?topLow=' + radioValue).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then((performanceData) => {
        console.log(performanceData);
        perfArraySchool = performanceData.map(x => x.School)
        perfArrayGrade = performanceData.map(x => x.AverageGrade * 100)
        console.log(perfArraySchool)
        console.log(perfArrayGrade)
        DrawBarChart();
    })
}

//Website for chartjs https://www.chartjs.org/docs/master/
DrawBarChart = () => {
    ctxBarChart.clearRect(0, 0, ctxBarChart.width, ctxBarChart.height);
    if (typeof myBarChart !== 'undefined') {
        myBarChart.destroy();
    }
    
     myBarChart = new Chart(ctxBarChart, {
        type: 'bar',
        data: {
            labels: perfArraySchool,
            datasets: [{
                label: 'Percentage of Students Who Met The Standard',
                data: perfArrayGrade,
                backgroundColor: [
                    '#793F0D',
                    '#AC703D',
                    '#C38E63',
                    '#E49969',
                    '#E5AE86',
                    '#EEC5A9',
                    '#9D9754',
                    '#C7C397',
                    '#B4A851',
                    '#DFD27C'
                ],
                borderColor: [
                    'rgba(139,236,226 0.2)',
                    'rgba(96A5F0)',
                    'rgba(96A5F0)',
                    'rgba(96A5F0)',
                    'rgba(96A5F0)',
                    'rgba(96A5F0)'
                ],
                borderWidth: 1
            }]
        },
         options: {
             responsive: false,
             scales: {
                 y: {
                     suggestedMin: 0,
                     suggestedMax: 100
                 }
                 
             }
        }


    });
}

DrawPieChart = (school, percentage) => {
    console.log(percentage);
    //Two-Step, get rid of %, then convert to float
    slicedPercentage = parseFloat(percentage.slice(0, -1));
    console.log(slicedPercentage);

    ctxPieChart.clearRect(0, 0, ctxPieChart.width, ctxPieChart.height);
    //Destroy the PieChart so we can redraw, but it will be undefined first time through
    if (typeof myPieChart !== 'undefined') {
        myPieChart.destroy();
    }
    myPieChart = new Chart(ctxPieChart, {
        type: 'pie',
        data: {
            labels: [school+' students below Poverty Line', school+' students above Poverty Line'],
            datasets: [
                {
                    label: 'Points',
                    backgroundColor: ['#f1c40f', '#2980b9'],
                    data: [slicedPercentage, 100-slicedPercentage]
                }
            ]
        },
        options: {
            responsive:false
        }
    });
}

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
                $('#school2').append($('<option></option>').val(school.$id).html(school.School1));
            });
        }
    });
});

function GetPovList() {

    var select = document.querySelector("#school2");
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
