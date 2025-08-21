import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/api/data/products.json");

export const readData = () => {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
};

export const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
