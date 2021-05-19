$(document).ready(function() {

    //this is working!!
    $('#prof-delete-table').on('click', '.deletemycoursebtn', function(){
        let rowID =  $(this).parent().parent().remove();
        // $(this).parent().parent().remove();

        let tr = $(this).closest('tr');
        let courseID = tr.find(".courseidinfo").text();
        let courseSection = tr.find(".coursesecinfo").text();

        var myData = {
            courseId: courseID,
            courseSection: courseSection,
        }

        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : "/profdeletecourse",
            data : JSON.stringify(myData),
            // datatype: 'json',
            success : function(html) {
                // $(this).parent().parent().remove();
                rowID.remove();
            }
        });
    })
})