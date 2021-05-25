$(document).ready(function() {
    $('#profrostertable').on('click', '.viewrosterbtn', function(){
        let tr = $(this).closest('tr');
        let courseID = tr.find(".courseIdInfo").text();
        
        var myData = {
            courseUniqueID: courseID
        }

        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : "/myroster",
            data : JSON.stringify(myData),
            success : function(students) {
                var html = '<tr><td><ul>';
                for (var i = 0; i < students.length; i++) {
                    html += '<li>' + students[i].firstname + " " + students[i].lastname + '</li>';
                }
                html += '</ul></td></tr>';
                $(html).insertAfter(tr);
                tr.find('.myCourse button').prop('disabled', true);
            }
        });
    })//end of call
})
