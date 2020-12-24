import express from "express";
import axios from "axios";
import asyncHandler from "express-async-handler";
import exceljs from "exceljs";
import path from "path";
import ejs from "ejs";

const app = express();

const dataArr = [];

app.get("/", (req, res) => {
  res.send("cool");
  users();
});

///// Phase 1 ////////

app.get("/create", (req, res) => {
  const users = asyncHandler(async () => {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/users/"
    );

    const Name = data.map((e) => e.name);
    const Username = data.map((e) => e.username);
    const Email = data.map((e) => e.email);
    const ZipCode = data.map((e) => e.address.zipcode);

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Phase 1 excel");
    worksheet.columns = [
      { header: "Name", key: "name", width: 10 },
      { header: "Username", key: "username", width: 10 },
      { header: "Email", key: "email", width: 10 },
      { header: "ZipCode", key: "address", width: 10 },
    ];

    data.forEach((x) => {
      worksheet.addRow(x);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    workbook.xlsx.writeFile("Test.xlsx");

    res.send("done");

    dataArr.push(data);
  });

  users();
});

const __dirname = path.resolve();

///// Phase 2 ////////

app.get("/download", function (req, res) {
  const file = __dirname + "/Test.xlsx";
  res.download(file);
});

///// Phase 3 ////////  (Before accessing this route run phase 1 i.e /create else it won't work because i did'nt use database to store my data)

app.get("/data", function (req, res) {
  res.render(__dirname + "/pages/data.ejs", { dataArr: dataArr });
});

const PORT = 5000;

app.listen(PORT, console.log("Server started at port" + PORT));
