$( document ).ready(function() {
  //adds a course to a user
  $('#searchresultstable').on('click', '.btnids', function(){
    let rowID =  $(this).parent().parent();
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
          // alert("Successfully enrolled in course.");
          tr.children('.openCourse').remove();
          tr.append('<td><button type="button" class="btn btn-danger">Enrolled</button></td>');
          $('.openCourse button').prop('disabled', true);
        }
        if(message === "enrolledAlready"){
          // alert("You are already enrolled in the course. Please drop in order to add.");
          tr.children('.openCourse').remove();
          tr.append('<td><button type="button" class="btn btn-danger">Already Enrolled</button></td>');
          $('.openCourse button').prop('disabled', true);
        }
      }
    });
  })//end of call
}) //end of ready function

// $(document).ajaxStop(function(){
//   setTimeout("window.location = '/addcourse'", 200);
// });