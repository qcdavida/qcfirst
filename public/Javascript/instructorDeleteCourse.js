$(document).ready(function() {
    $('#prof-delete-table').on('click', '.deletemycoursebtn', function(){
        let rowID =  $(this).parent().parent();

        let tr = $(this).closest('tr');
        let courseID = tr.find(".courseInfo").text();

        var myData = {
            courseUniqueID: courseID
        }

        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : "/profdeletecourse",
            data : JSON.stringify(myData),
            success : function() {
                rowID.remove();
            }
        });
    })
})