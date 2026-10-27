---

# 👥 Team Directory & Attendance Management App

A modern, highly responsive Team Directory and daily attendance tracking web application featuring a sleek **Neumorphic design**, clean card layouts, real-time analytics dashboards, and support for file bulk imports.

---

## ✨ Features

* **🗂️ Clean Separation:** Decoupled architecture cleanly separated into `index.html`, `style.css`, and `script.js`.
* **📊 Analytics Dashboard:** Real-time stats displaying:
* **Total Team Count**
* **Department-wise Breakdown** (with vertical scroll)
* **Nationality Breakdown**
* **Today's Attendance by Nationality**


* **📁 Bulk File Upload:** Instantly import and arrange team members using standard `.csv` files or `.json` arrays.
* **✅ Attendance Tracker:** Easily toggle individual staff attendance ("Mark Present" / "✓ Present Today") with live calculations.
* **🔍 Instant Search:** Search dynamically across all records by name, department, job title, nationality, or visa source.
* **➕ Individual Management:** Add newcomers via an intuitive modal popup or delete records instantly.
* **💾 Local Persistence:** Automatically saves all records and attendance statuses securely in your browser's `localStorage`.

---

## 🛠️ Tech Stack

* **HTML5** (Structure & Semantic Markup)
* **CSS3** (Custom Neumorphic Shadows, Grid & Flexbox Layouts)
* **Vanilla JavaScript (ES6+)** (DOM Manipulation, State Management, Local Storage & File API)

---

## 🚀 Getting Started

To run this project locally on your machine, follow these simple steps:

1. Clone or download this repository to your local computer:
```bash
git clone https://github.com/YOUR-USERNAME/team-directory.git

```


2. Navigate into the project folder:
```bash
cd team-directory

```


3. Open **`index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari).

---

## 📁 CSV Upload Format

If you are uploading an Excel/CSV file to populate your directory, ensure your CSV file includes a header row and follows this exact column order:

| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 |
| --- | --- | --- | --- | --- |
| **Department** | **Full Name** | **Nationality** | **Job Title** | **From** *(own, aamcom, ekis, business visa)* |

---

## 💡 License

This project is open-source and free to use for personal and professional team management.
