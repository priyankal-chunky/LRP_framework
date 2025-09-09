const fs = require('fs')
const XLSX = require('xlsx');


/**
 * Extracts the test case ID from a given title.
 * @param {string} title - The title of the test case.
 * @returns {string} The extracted test case ID or an empty array if no ID is found.
 */
function extractTestCaseIds(title) {
  const idPattern = /TC-\d+/g; // Pattern to find test case ID like "TC-XXX"
  const matches = title.match(idPattern);
  return matches || []; // Return an empty array if no matches
}

/**
 * Gets the current date formatted as dd/MM/yyyy.
 * @returns {string} Formatted date string.
 */
function getFormattedCurrentDate() {
  const currentDate = new Date();
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return dateFormatter.format(currentDate); // Returns date in dd/MM/yyyy format
}

function log(message) {
  console.log(message);
}

/**
 * Function used to set metadata like policyName, frameworkName, controlName, etc.
 * @param {*} metaData
 */
function setMetadata(metaData = {}) {
  try {
    if (!fs.existsSync("metadata.json")) {
      console.log("metadata.json file not found. Initializing new metadata.");
      fs.writeFileSync("metadata.json", JSON.stringify({ data: [] }), "utf8");
    }

    const jsonData = JSON.parse(fs.readFileSync("metadata.json", "utf8"));

    console.log("Pushing the following metadata:", JSON.stringify(metaData));

    // Add the new metadata to the data array
    jsonData.data.push({
      policyName: metaData.policyName,
    });

    // Write the updated JSON data back to the file
    fs.writeFileSync("metadata.json", JSON.stringify(jsonData), "utf8");
  } catch (error) {
    console.error("Error setting metadata:", error);
  }
}

/**
 * To get the current timestamp in yyyyMMddHHmmss format
 */
function getFormattedCurrentDateAndTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const timestamp = year + month + day + hour + minute + second;
  const randomNumber = generateRandomNumber();
  return `${timestamp}${randomNumber}`;
}

/**
 * To generate Random Numbers
 */
async function generateRandomNumber() {
  const randomNum = Math.random() * 9000;
  return Math.floor(1000 + randomNum);
}

/**
 * To read the locators from the locator sheet
  @param {} locatorFileName 
  @param {} sheetName 
  @param {} environment 
 * @returns 
 */
  function readTestData(locatorFileName, sheetName, environment) {
    try {
      const filePath = `./testdata/${locatorFileName}.xlsx`;
      const workbook = XLSX.readFile(filePath);
  
      // Check if the sheet exists
      if (!workbook.Sheets[sheetName]) {
        console.error(`Sheet "${sheetName}" not found in ${locatorFileName}.xlsx`);
        return null; // or throw new Error("Sheet not found");
      }
  
      const sheet = workbook.Sheets[sheetName]; // Access the sheet
      const data = XLSX.utils.sheet_to_json(sheet); // Convert the sheet to JSON
  
      // Check if the data is not empty
      if (!data.length) {
        console.warn(`No data found in sheet "${sheetName}" of ${locatorFileName}.xlsx`);
        return null; // or throw new Error("No data found");
      }
  
      // Convert the array of objects to key-value pairs
      const lookup = {};
      data.forEach(row => {
        if (row.Locator_name && row[environment]) { // Validate the existence of expected keys
          lookup[row.Locator_name] = row[environment]; // Map Locator_name to environment
        } else {
          console.warn(`Missing Locator_name or environment column for row: ${JSON.stringify(row)}`);
        }
      });
  
      return lookup;
    } catch (error) {
      console.error("Error reading test data:", error);
      return null; // or throw new Error("Failed to read test data");
    }
  }
  
  /**
   * To get the row count of the sheet in the test data file
    @param {} filePath 
    @param {} sheetName 
   * @returns 
   */
  async function getRowCount(filePath, sheetName) {
    try {
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
  
      const sheet = workbook.Sheets[sheetName];
  
      // Convert the sheet to JSON
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Use header: 1 to get raw data
  
      // Get the row count
      const rowCount = data.length; // data.length gives the number of rows
  
      return rowCount;
    } catch (error) {
      console.error("Error getting row count:", error);
      return 0;
    }
  }
  
  /**
   * Method for reading data from Test data file
    @param {} filePath 
    @param {} sheetName 
    @param {} headerName 
    @param {} rowNumber 
   * @returns 
   */
  async function getValueByRowAndHeader(filePath, sheetName, headerName, rowNumber) {
    try {
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[sheetName];
  
      // Convert the sheet to JSON
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // Find the index of the header
      const headers = data[0]; // First row contains the headers
      const headerIndex = headers.indexOf(headerName);
  
      if (headerIndex === -1) {
        console.log(`Header "${headerName}" not found.`);
        return null;
      }
  
      // Adjust for 0-based indexing (rowNumber is typically 1-based)
      const adjustedRowNumber = rowNumber + 1;
  
      if (adjustedRowNumber < 1 || adjustedRowNumber >= data.length) {
        console.log(`Row number ${rowNumber} is out of range.`);
        return null;
      }
  
      // Get the value under the specified header and row number
      const value = data[adjustedRowNumber][headerIndex];
      return value;
    } catch (error) {
      console.error("Error getting value by row and header:", error);
      return null;
    }
  }
 /**
  * Method to get cell value by identifying a specific row using a unique identifier in the first column
  * @param {*} filePath 
  * @param {*} sheetName 
  * @param {*} firstColumnHeader 
  * @param {*} rowIdentifier 
  * @param {*} targetColumnHeader 
  * @returns 
  */

  async function getCellValueByRowIdentifier(filePath, sheetName, firstColumnHeader, rowIdentifier, targetColumnHeader){
    try {
        // Read workbook and sheet
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet into JSON objects (header row is used as keys)
  const data = XLSX.utils.sheet_to_json(sheet);

  // Find the row where firstColumnHeader matches rowIdentifier
  const targetRow = data.find(row => row[firstColumnHeader] == rowIdentifier);

  if (!targetRow) {
    throw new Error(`Row with ${firstColumnHeader}="${rowIdentifier}" not found`);
  }

  // Get value under target column
  if (!(targetColumnHeader in targetRow)) {
    throw new Error(`Column "${targetColumnHeader}" not found`);
  }

  return targetRow[targetColumnHeader];

    }catch(error){
        console.error("Error getting cell value by row identifier:", error);
        return null;
    }
  }
/**
 * Method to decide whether to run the test case or not based on the flag in the test execution sheet
 * @param {*} filePath 
 * @param {*} sheetName 
 * @param {*} testCaseID 
 * @returns 
 */


function runTestByFlag(filePath, sheetName, testCaseID) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const row = data.find(r => r["Testcase ID"] === testCaseID);
    if (!row) return false;

    return row.Flag?.toLowerCase() === "yes";
  } catch (error) {
    console.error("Error reading Excel:", error);
    return false;
  }
}

  /**
   * Method for reading the Test execution file
    @param {} filePath 
    @param {} sheetName 
    @param {} headerName 
   * @returns 
   */
  function getValuesByHeaderAndCondition(filePath, sheetName, headerName) {
    try {
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[sheetName];
  
      // Convert the sheet to JSON
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // Find the index of the header
      const headers = data[0]; // First row contains the headers
      const headerIndex = headers.indexOf(headerName);
      const conditionIndex = headers.indexOf('Condition'); // Index for "Condition"
  
      if (headerIndex === -1) {
        console.log(`Header "${headerName}" not found.`);
        return [];
      }
  
      if (conditionIndex === -1) {
        console.log(`Header "Condition" not found.`);
        return [];
      }
  
      // Collect values where Condition is "yes"
      const filteredValues = [];
      for (let i = 1; i < data.length; i++) { // Start from 1 to skip headers
        if (data[i][conditionIndex] && data[i][conditionIndex].toLowerCase() === 'yes') {
          filteredValues.push(data[i][headerIndex]);
        }
      }
  
      return filteredValues; // Return all matching values
    } catch (error) {
      console.error("Error getting values by header and condition:", error);
      return [];
    }
  }
  
  /**
   * To write data in the desired excel sheet.
    @param {} filePath 
    @param {} sheetName 
    @param {} rowHeader 
    @param {} colHeader 
    @param {} value 
   * @returns 
   */
  function writeToExcel(filePath, sheetName, rowHeader, colHeader, value) {
    // Read the existing workbook
    const workbook = XLSX.readFile(filePath);
  
    // Check if the specified sheet exists
    if (!workbook.Sheets[sheetName]) {
      console.error(`Sheet named "${sheetName}" does not exist in the workbook.`);
      return;
    }
  
    // Get the specified worksheet
    const worksheet = workbook.Sheets[sheetName];
  
    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref']);
  
    let rowIndex = -1;
    let colIndex = -1;
  
    // Find the column index for the specified column header
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // First row for headers
      if (worksheet[cellAddress] && worksheet[cellAddress].v === colHeader) {
        colIndex = col;
        break;
      }
    }
  
    // Find the row index for the specified row header
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 }); // First column for row headers
      if (worksheet[cellAddress] && worksheet[cellAddress].v === rowHeader) {
        rowIndex = row;
        break;
      }
    }
  
    // Check if the specified row and column were found
    if (rowIndex === -1) {
      console.error(`Row header "${rowHeader}" not found in sheet "${sheetName}".`);
      return;
    }
    if (colIndex === -1) {
      console.error(`Column header "${colHeader}" not found in sheet "${sheetName}".`);
      return;
    }
  
    // Write data to the specific cell
    worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })] = { v: value };
  
    // Write the updated workbook back to the file
    XLSX.writeFile(workbook, filePath);
  
    console.log(`Data written to ${filePath} at row header "${rowHeader}", column header "${colHeader}" in sheet "${sheetName}"`);
  }

  /**
 * Function to get value based on a given component
 * @param {string} filePath - Path to the Excel file.
 * @param {string} sheetName - Name of the sheet to read.
 * @param {string} componentName - Name of the component to search for.
 * @returns {string|undefined} - Corresponding value or undefined if not found.
 */
function getValueByComponent(filePath, sheetName, componentName) {
  // Load the workbook and specified sheet
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Find the header row containing "Components" and "Value"
  const headerRow = data.find(row => row.includes("Components") && row.includes("Value"));
  if (!headerRow) {
      console.log("Headers not found in the sheet.");
      return;
  }

  // Identify column indices for "Components" and "Value"
  const componentIndex = headerRow.indexOf("Components");
  const valueIndex = headerRow.indexOf("Value");

  // Search for the component in the rows following the header row
  const dataRows = data.slice(data.indexOf(headerRow) + 1); // Skip header row
  for (const row of dataRows) {
      if (row[componentIndex] === componentName) {
          return row[valueIndex];
      }
  }

  return undefined;
}


module.exports = {
  extractTestCaseIds,
  getFormattedCurrentDate,
  log,
  setMetadata,
  getFormattedCurrentDateAndTime,
  generateRandomNumber,
  readTestData,
  getRowCount,
  getValueByRowAndHeader,
  getValuesByHeaderAndCondition,
  writeToExcel,
  getValueByComponent,
  getCellValueByRowIdentifier,
  runTestByFlag
};
