$(document).ready(function() {
    //for dropping a class as a student
    $('#dropclasstable').on('click', '.deletebtn', function(){
        let rowID =  $(this).parent().parent();
        let tr = $(this).closest('tr');
        let courseUniqueID = tr.find(".courseInfo").text(); 

        var tableData = {
            courseID: courseUniqueID
        }

        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : "/removecourse",
            data : JSON.stringify(tableData),
            success : function(message) {
                if(message === "success"){
                    rowID.remove();
                }
            }
        });
    }) //end of call
})