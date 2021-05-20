$( document ).ready(function() {

    $('#searchresultstable').on('click', '.btnids', function(){
      let rowID =  $(this).parent().parent().remove();
      // $(this).parent().parent().remove();

      let tr = $(this).closest('tr');
      let courseID = tr.find(".courseinfo").text(); 

      var tableData = {
        courseNumber: courseID,
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
              alert("Success baby :)");
          }
      });
  })

  //for dropping a class as a student
  $('#dropclasstable').on('click', '.deletebtn', function(){
    let rowID =  $(this).parent().parent().remove();
    let tr = $(this).closest('tr');
    let courseID = tr.find(".courseinfo").text(); 

    var tableData = {
      courseNumber: courseID
    }

    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "/deletecourse",
        data : JSON.stringify(tableData),
        // datatype: 'json',
        success : function(html) {
            // $(this).parent().parent().remove();
            rowID.remove();
            alert("Hate to see you go, but love watching you leave.");
        }
    });
  })
}) //end of ready function
