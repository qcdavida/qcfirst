$( document ).ready(function() {
  //adds a course to a user
  $('#searchresultstable').on('click', '.btnids', function(){
    let tr = $(this).closest('tr');
    let courseUniqueID = tr.find(".courseInfo").text();
    
    var tableData = {
      courseID: courseUniqueID
    }

    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/savecourse",
      data : JSON.stringify(tableData),
      success : function(message) {
        if(message === "success"){
          tr.children('.openCourse').remove();
          tr.append('<td><button type="button" class="btn btn-danger">Enrolled</button></td>');
          $('.openCourse button').prop('disabled', true);
        }
        if(message === "enrolledAlready"){
          tr.children('.openCourse').remove();
          tr.append('<td><button type="button" class="btn btn-danger">Already Enrolled</button></td>');
          $('.openCourse button').prop('disabled', true);
        }
        if(message === "timeConflict"){
          tr.children('.openCourse').remove();
          tr.append('<td><button type="button" class="btn btn-danger">Time Conflict w/another course</button></td>');
        }
      }
    });
  })//end of call
}) //end of ready function