function loadProductHistory() {
    const historyData = [
      {
        title: "Chocolate Cake",
        price: 90,
        category: "Cakes",
        dateAdded: "2024-04-12"
      },
      {
        title: "Grilled Chicken",
        price: 120,
        category: "Main Courses",
        dateAdded: "2024-04-10"
      },
      {
        title: "Mango Smoothie",
        price: 40,
        category: "Beverages",
        dateAdded: "2024-04-09"
      },
      {
        title: "Ice Cream Sundae",
        price: 50,
        category: "Desserts",
        dateAdded: "2024-04-08"
      }
    ];
  
    const tableBody = document.getElementById("historyTableBody");
  
    if (tableBody) {
      tableBody.innerHTML = "";
  
      historyData.forEach((item, index) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.title}</td>
          <td>${item.price} EGP</td>
          <td>${item.category}</td>
          <td>${item.dateAdded}</td>
        `;
  
        tableBody.appendChild(row);
      });
    } else {
      console.error("History table body not found.");
    }
  }
  
  loadProductHistory();
  