$( document ).ready(function() {
  // $("#userForm").submit(function(event) {
	// 	// Prevent the form from submitting via the browser.
	// 	event.preventDefault();
	// 	ajaxPost();
	// });
  ajaxPost();

  //Try something like this as it was able to grab the entire row
  // alert("damnnnn")
  // window.location.href='/roster';
  // let tbody = $(this).closest('tbody');
  // let v = tbody.find('.rowid').text();
  // alert("Count " + v)
  function ajaxPost(){
    $(document).on("click","#searchresultstable button.btnids", function() {
      let tr = $(this).closest('tr');
      let courseID = tr.find(".courseidinfo").text();
      let courseSection = tr.find(".coursesecinfo").text();
      var rowID = $('.btnids').attr('id');
      // var rowID = $('.rowID').attr('uniqueKey');

      var formData = {
        courseId: courseID,
        courseSection: courseSection,
      }
  
      $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "/savecourse",
        data : JSON.stringify(formData),
        datatype: 'json',
        success : function(message) {
          alert("hell waits for no one");
          $('.' + rowID).fadeOut('slow', function(){
            // $('#' + rowID).parent().remove();
            alert(rowID);
            $('.' + rowID).remove();
          })

          // $('#' + rowID).fadeOut('slow', function(){
          //   console.log("go shorty...");
          //   $('#' + rowID).remove();
          // });
        },
        error : function(e) {
          alert("Error 1")
          console.log("ERROR: ", e);
        }
      });
    });
    // resetData();

    $(document).on("click","#dropclasstable button.deletebtn", function() {
      let tr = $(this).closest('tr');
      let courseID = tr.find(".courseidinfo").text();
      let courseSection = tr.find(".coursesecinfo").text(); 

      var formData = {
        courseId: courseID,
        courseSection: courseSection,
      }
  
      $.ajax({
        type : "POST",
        contentType : "application/json",
        url : "/deletecourse",
        data : JSON.stringify(formData),
        dataType : 'json',
        success : function(message) {
          alert("Frozen hell")
        },  
        error : function(e) {
          alert("Error 2")
          console.log("ERROR: ", e);
        }
      });
    });
  }

  // function resetData(){
  //   $(".courseidinfo").text("");
  //   $(".coursesecinfo").text("");
  // }
}) //end of ready function

  // $(document ).on("click","#searchresultstable button.btnids",function() {
  //   let tr = $(this).closest('tr');
  //   let courseId = tr.find(".courseidinfo").text();
  //   let courseSection = tr.find(".coursesecinfo").text(); 
  //   let courseName = tr.find(".coursenameinfo").text();
  //   alert('Table 1: ' + courseId + ' ' + courseSection + ' ' + courseName);  
  //   console.log(courseId + " " + courseSection + " " + courseName);
  // });

// Below code works
// $(document).ready(function () {
//   $('tr').click(function () {
//       if(this.style.background == "" || this.style.background =="white") {
//           $(this).css('background', 'red');
//       }
//       else {
//           $(this).css('background', 'white');
//       }
//   });
// });
