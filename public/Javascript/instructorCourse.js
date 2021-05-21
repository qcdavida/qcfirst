$(document).ready(function() {
    $('#prof-delete-table').on('click', '.deletemycoursebtn', function(){
        let rowID =  $(this).parent().parent().remove();
        // $(this).parent().parent().remove();

        let tr = $(this).closest('tr');
        let courseID = tr.find(".courseInfo").text();
        let courseSection = tr.find(".coursesecinfo").text();

        var myData = {
            courseUniqueID: courseID
        }

        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : "/profdeletecourse",
            data : JSON.stringify(myData),
            // datatype: 'json',
            success : function() {
                rowID.remove();
            }
        });
    })

    $('#profrostertable').click(function () {
        if($("#collapseme").hasClass("out")) {
            $("#collapseme").addClass("in");
            $("#collapseme").removeClass("out");
        } else {
            $("#collapseme").addClass("out");
            $("#collapseme").removeClass("in");
        }
    });
})