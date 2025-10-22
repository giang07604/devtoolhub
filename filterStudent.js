async function fetchStudentData(class_id) {
  const fetchLink = `https://lms.languagehub.vn/teacher/student?key_search=&class_id=${class_id}&per_page=100`;
  let studentData = [];

  try {
    const response = await fetch(fetchLink);
    const data = await response.text();

    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, "text/html");
    const tableRows = htmlDocument.querySelectorAll(".custom-table tbody tr");

    tableRows.forEach((row) => {
      const code = row.querySelector(".text-left:nth-child(1)")?.textContent.trim() || "";
      const darkBlueElements = row.querySelectorAll(".d-block.text-dark-blue");
      const darkBlueText = darkBlueElements.length > 1 ? darkBlueElements[1].textContent.trim() : "";
      studentData.push({
        code: code,
        fullname: darkBlueText,
      });
    });
  } catch (error) {
    console.error("Đã xảy ra lỗi khi fetch dữ liệu:", error);
  }

  return studentData;
}
function removeOverdue(text) {
  if (text.includes("(Overdue)")) {
    return text.replace("(Overdue)", "").trim();
  }
  return text;
}
function get_class_id(){
    return document.getElementById("class_id").value
}
// ======= CHẠY XỬ LÝ DỮ LIỆU =======
fetchStudentData(get_class_id())
  .then((fetchedData) => {
    const studentData = fetchedData;
    // Giả sử mày có biến 'rows' là danh sách các dòng cần đối chiếu
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach((row) => {
      try {
        const nameCell = row.querySelector("td:nth-child(1)");
        const studentName = nameCell ? nameCell.textContent.trim() : "";

        const studentInfo = Array.isArray(studentData)
          ? studentData.find(
              (student) =>
                student.fullname === removeOverdue(studentName)
            )
          : undefined;

        if (!studentInfo) {
          console.log(`Đã xoá sinh viên: ${studentName} khỏi danh sách do không đúng lớp`);
          row.remove();
          return;
        }

        // Xử lý thêm gì đó với studentInfo nếu cần
      } catch (err) {
        console.error("Lỗi khi xử lý dòng:", err);
      }
    });
  })
  .catch((error) => {
    console.error("Lỗi khi fetch dữ liệu:", error);
  });
