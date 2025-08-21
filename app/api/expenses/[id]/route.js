import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app", "api", "data", "db.json");

function readData() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// PUT → Update
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const expenses = readData();
  const index = expenses.findIndex((e) => String(e.id) === String(id));

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  expenses[index] = {
    ...expenses[index],
    ...body,
    editedAt: new Date().toLocaleString(), // ✅ edited ka time save
  };

  writeData(expenses);
  return NextResponse.json(expenses[index]);
}

// DELETE → Remove
export async function DELETE(req, { params }) {
  const { id } = params;
  let expenses = readData();

  expenses = expenses.filter((e) => String(e.id) !== String(id));

  writeData(expenses);
  return NextResponse.json({ message: "Deleted" });
}
