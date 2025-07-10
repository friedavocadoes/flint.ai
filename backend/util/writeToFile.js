import { writeFile, appendFile } from "fs/promises";
import path from "path";

export async function writeToFile(data, filename = "paymentLogs.json") {
  const filePath = path.resolve("logs", filename);
  const logLine = JSON.stringify(data) + "\n";
  try {
    await appendFile(filePath, logLine, "utf8");
  } catch (err) {
    // If file/folder doesn't exist, create it and write
    if (err.code === "ENOENT") {
      await writeFile(filePath, logLine, "utf8");
    } else {
      throw err;
    }
  }
}
