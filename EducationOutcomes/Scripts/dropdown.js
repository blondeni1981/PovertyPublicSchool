var uri = 'api/dropdown';

////Function to populate district drop down
$(function () {
    $.ajax({
        type: "GET",
        url: 'api/dropdown/district',
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