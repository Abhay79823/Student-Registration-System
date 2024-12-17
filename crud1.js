window.onload = function () {
    var addStudents = document.getElementById("add-students");
  
    if (!addStudents) {
      console.error("Element with ID 'add-students' not found.");
      return;
    }
  
    addStudents.onclick = function (e) {
      e.preventDefault();
      Swal.fire({
        title: "Student Form",
        showConfirmButton: false,
        html: `
             <form id="student-form">
                <label>Student Name</label>
                <input id="student-name" type="text" pattern="[A-Za-z\s]+"  required/>
                <div id="name-error" class="error" ></div>
                <label>Student ID</label>
                <input id="student-id" type="number" required/>
                <div id="id-error" class="error"></div>
                <label>Email ID</label>
                <input id="student-email" type="email" required title="Please enter a valid email (e.g., user@example.com)" />
                <div id="email-error" class="error"></div>
                <label>Contact</label>
                <input id="student-contact" type="number" maxlength="10" required/>
                <div id="contact-error" class="error"></div>
                <button type="submit" id="submit-form">Submit</button>
             </form>
           `,
      });
  
      var submitForm = document.getElementById("submit-form");
      submitForm.addEventListener("click", function (e) {
        e.preventDefault();
  
        // Clear previous error messages
        document.getElementById("name-error").innerHTML = '';
        document.getElementById("id-error").innerHTML = '';
        document.getElementById("email-error").innerHTML = '';
        document.getElementById("contact-error").innerHTML = '';
  
        // Collect form values
        var studentName = document.getElementById("student-name").value;
        var studentId = document.getElementById("student-id").value;
        var studentEmail = document.getElementById("student-email").value;
        var studentContact = document.getElementById("student-contact").value;
  
        // Validate inputs
        var isValid = true;
  
        if (!studentName || !studentId || !studentEmail || !studentContact) {
          Swal.fire({
            icon: "error",
            title: "Invalid Input",
            text: "All fields are required!",
          });
          isValid = false;
        }
  
        // Validate Name (only letters and spaces)
        var nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(studentName)) {
          document.getElementById("name-error").innerHTML = "Name should only contain characters and spaces.";
          isValid = false;
        }
  
        // Validate Email (must be a valid email format)
        var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(studentEmail)) {
          document.getElementById("email-error").innerHTML = "Please enter a valid email address (e.g., user@example.com).";
          isValid = false;
        }
  
        // Validate Contact (must be exactly 10 digits and start with 6, 7, 8, or 9)
        var contactRegex = /^[6-9][0-9]{9}$/;
        if (!contactRegex.test(studentContact)) {
          document.getElementById("contact-error").innerHTML = "Invalid Contact No.";
          isValid = false;
        }
  
        // Validate that student ID, email, and contact do not already exist in the local storage
        var data = localStorage.getItem("student");
        var existingEmail = false;
        var existingContact = false;
        var existingStudentId = false;
  
        if (data != null) {
          var oldData = JSON.parse(data);
  
          existingEmail = oldData.some(function (student) {
            return student.email === studentEmail;
          });
  
          existingContact = oldData.some(function (student) {
            return student.contact === studentContact;
          });
  
          existingStudentId = oldData.some(function (student) {
            return student.studentId === studentId;
          });
        }
  
        if (existingEmail) {
          document.getElementById("email-error").innerHTML = "This email is already registered.";
          isValid = false;
        }
  
        if (existingContact) {
          document.getElementById("contact-error").innerHTML = "This contact number is already registered.";
          isValid = false;
        }
  
        if (existingStudentId) {
          document.getElementById("id-error").innerHTML = "This student ID is already registered.";
          isValid = false;
        }
  
        if (!isValid) {
          return; // If any validation failed, prevent submission
        }
  
        var students = {
          name: studentName,
          studentId: studentId,
          email: studentEmail,
          contact: studentContact,
        };
  
        try {
          if (data == null) {
            localStorage.setItem("student", JSON.stringify([students]));
            Swal.fire({
              icon: "success",
              title: "Data Added",
            }).then(function () {
              window.location.reload();
            });
          } else {
            var oldData = JSON.parse(data);
            oldData.push(students);
            localStorage.setItem("student", JSON.stringify(oldData));
  
            Swal.fire({
              icon: "success",
              title: "Data Added",
            }).then(function () {
              window.location.reload();
            });
          }
        } catch (err) {
          console.error("Invalid JSON data in localStorage: ", err);
          Swal.fire({
            icon: "error",
            title: "Storage Error",
            text: "Local storage contains invalid data. Please clear storage and try again.",
          });
          localStorage.removeItem("student");
        }
      });
    };
  
    var data1 = localStorage.getItem("student");
    try {
      if (data1 != null) {
        var original = JSON.parse(data1);
        for (var i = 0; i < original.length; i++) {
          var tr = document.createElement("tr");
  
          var SnoTd = document.createElement("td");
          SnoTd.innerHTML = i + 1;
          tr.append(SnoTd);
  
          var nameTd = document.createElement("td");
          nameTd.innerHTML = original[i].name;
          tr.append(nameTd);
  
          var studentIdTd = document.createElement("td");
          studentIdTd.innerHTML = original[i].studentId;
          tr.append(studentIdTd);
  
          var emailTd = document.createElement("td");
          emailTd.innerHTML = original[i].email;
          tr.append(emailTd);
  
          var contactTd = document.createElement("td");
          contactTd.innerHTML = original[i].contact;
          tr.append(contactTd);
  
          var actionTd = document.createElement("td");
          var editBtn = document.createElement("button");
          var deleteBtn = document.createElement("button");
  
          editBtn.innerHTML = "<i class='ri-file-edit-fill'> Edit</i>";
          editBtn.setAttribute("class", "edit-button");
          editBtn.setAttribute("row-index", i);
  
          deleteBtn.innerHTML = "<i class='ri-delete-bin-7-line'> Delete</i>";
          deleteBtn.setAttribute("class", "delete-button");
          deleteBtn.setAttribute("row-index", i);
  
          actionTd.append(editBtn);
          actionTd.append(deleteBtn);
          tr.append(actionTd);
          actionTd.setAttribute("class","action-button")
  
          var studentTable = document.getElementById("student-table");
          studentTable.append(tr);
  
          deleteBtn.onclick = function () {
            var index = this.getAttribute("row-index");
            original.splice(index, 1);
            localStorage.setItem("student", JSON.stringify(original));
            window.location.reload();
          };
  
          editBtn.onclick = function () {
            var index = this.getAttribute("row-index");
            var editableStudent = original[index];
  
            Swal.fire({
              title: "Update Form",
              showConfirmButton: false,
              html: `
                   <form id="student-form">
                      <label>Student Name</label>
                      <input value="${editableStudent.name}" id="student-name" type="text" pattern="[A-Za-z\s]+" required/>
                      <label>Student ID</label>
                      <input value="${editableStudent.studentId}" id="student-id" type="number" required/>
                      <label>Email ID</label>
                      <input value="${editableStudent.email}" id="student-email" type="email" required />
                      <label>Contact</label>
                      <input value="${editableStudent.contact}" id="student-contact" type="number" required/>
                      <button type="submit" id="update-form">Update</button>
                   </form>
                 `,
            });
  
            document.getElementById("update-form").addEventListener("click", function (e) {
              e.preventDefault();
  
              editableStudent.name = document.getElementById("student-name").value;
              editableStudent.studentId = document.getElementById("student-id").value;
              editableStudent.email = document.getElementById("student-email").value;
              editableStudent.contact = document.getElementById("student-contact").value;
  
              original[index] = editableStudent;
              localStorage.setItem("student", JSON.stringify(original));
  
              Swal.fire({
                icon: "success",
                title: "Data Updated",
              }).then(function () {
                window.location.reload();
              });
            });
          };
        }
      }
    } catch (err) {
      console.error("Invalid JSON data in localStorage: ", err);
      Swal.fire({
        icon: "error",
        title: "Storage Error",
        text: "Local storage contains invalid data. Please clear storage and try again.",
      });
      localStorage.removeItem("student");
    }
  
    var printBtn = document.getElementById("print-btn");
    printBtn.onclick = function () {
      window.print();
    };
  };
  
  
  