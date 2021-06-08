var uri = 'api/Outcomes';

let mySchoolArray = [];
let ctx = document.getElementById('myChart').getContext('2d');
let myChart;
let perfArraySchool = [];
let perfArrayGrade = [];

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
        DrawChart();
    })
}

DrawChart = () => {
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    if (typeof myChart !== 'undefined') {
        myChart.destroy();
    }
    
     myChart = new Chart(ctx, {
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