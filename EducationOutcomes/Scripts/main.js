var uri = 'api/Outcomes';
mySchoolArray = [];

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