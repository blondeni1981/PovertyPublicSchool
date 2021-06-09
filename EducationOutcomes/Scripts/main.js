﻿var uri = 'api/Outcomes';

let mySchoolArray = [];
let ctxBarChart = document.getElementById('myBarChart').getContext('2d');
let ctxPieChart = document.getElementById('myPieChart').getContext('2d');
let myBarChart;
let myPieChart;
let perfArraySchool = [];
let perfArrayGrade = [];

//https://www.chartjs.org/docs/master/

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
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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
    if (typeof myPieChart !== 'undefined') {
        myPieChart.destroy();
    }
    myPieChart = new Chart(ctxPieChart, {
        type: 'doughnut',
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