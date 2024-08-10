document
        .getElementById("reportForm")
        .addEventListener("submit", function (event) {
          event.preventDefault();

          const reportType = document.getElementById("reportType").value;
          if (reportType) {
            fetch(`http://localhost:5000/${reportType}`)
              .then((response) => response.json())
              .then((data) => {
                renderTable(data);
                document.getElementById("exportBtnModal").style.display =
                  "block";
                $("#reportModal").modal("show");
              })
              .catch((error) => console.error("Error:", error));
          }
        });

      function renderTable(data) {
        const container = document.getElementById("reportTableContainerModal");
        container.innerHTML = "";

        if (data.length === 0) {
          container.innerHTML = "<p>No hay datos disponibles.</p>";
          return;
        }

        const table = document.createElement("table");
        table.className = "table table-striped";
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        // Generate table headers
        const headers = Object.keys(data[0]);
        const theadRow = document.createElement("tr");
        headers.forEach((header) => {
          const th = document.createElement("th");
          th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
          theadRow.appendChild(th);
        });
        thead.appendChild(theadRow);

        // Generate table rows
        data.forEach((row) => {
          const tr = document.createElement("tr");
          headers.forEach((header) => {
            const td = document.createElement("td");
            td.textContent = row[header];
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);
      }

      document
        .getElementById("exportBtnModal")
        .addEventListener("click", function () {
          const table = document.querySelector(
            "#reportTableContainerModal table"
          );
          if (!table) {
            alert("No hay datos para exportar.");
            return;
          }

          const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
          XLSX.writeFile(wb, "reporte.xlsx");
        });