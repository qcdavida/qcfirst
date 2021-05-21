$( document ).ready(function() {

    //addes a course to a user
    $('#searchresultstable').on('click', '.btnids', function(){
      let rowID =  $(this).parent().parent().remove();
      // $(this).parent().parent().remove();

      let tr = $(this).closest('tr');
      let courseUniqueID = tr.find(".courseInfo").text(); 
      let courseSec = tr.find(".courseSecInfo").text(); 

      var tableData = {
        courseID: courseUniqueID
      }

      $.ajax({
          type : "POST",
          contentType : "application/json",
          url : "/savecourse",
          data : JSON.stringify(tableData),
          // datatype: 'json',
          success : function(html) {
              // $(this).parent().parent().remove();
              rowID.remove();
          }
      });
  })

  //for dropping a class as a student
  $('#dropclasstable').on('click', '.deletebtn', function(){
    let rowID =  $(this).parent().parent().remove();
    let tr = $(this).closest('tr');
    let courseID = tr.find(".courseInfo").text(); 

    var tableData = {
      courseUniqueID: courseID
    }

    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "/deletecourse",
        data : JSON.stringify(tableData),
        // datatype: 'json',
        success : function(html) {
            rowID.remove();
        }
    });
  })
}) //end of ready function
