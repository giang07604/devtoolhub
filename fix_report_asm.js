var studentCode = [];
var class_id = document.getElementById("select_class_id").value;
fetch(
  "https://lms.languagehub.vn/teacher/student?key_search=&class_id=" + class_id + "&per_page=50"
)
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, "text/html");
    const tableRows = htmlDocument.querySelectorAll(".custom-table tbody tr");
    tableRows.forEach((row) => {
      if (
        row
          .querySelector(".text-left:nth-child(2) span:nth-child(2)")
          .textContent.trim() == "Active"
      ) {
        var code = row
          .querySelector(".text-left:nth-child(1)")
          .textContent.trim();
        studentCode.push(code);
      }
    });
    var tbodyRows = document.querySelectorAll("tbody tr");
    var theadRows = document.querySelectorAll("thead tr");
    theadRows[0].querySelector("th:nth-child(3)").textContent = "Student Code";
    theadRows[1].style.borderBottom = "1px solid #ececec";
    tbodyRows.forEach(function (row, index) {
      row.querySelector("td:nth-child(3)").textContent = studentCode[index];
    });
    console.log("Processed successfully, you can close this tab")
  })
  .catch((error) => {
    console.error("Đã xảy ra lỗi:", error);
  });
