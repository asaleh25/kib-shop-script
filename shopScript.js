const fs = require('fs');
const readline = require('readline');

var args = process.argv.slice(2);
var fileName = args[0];

const stream = fs.createReadStream(fileName);
const reader = readline.createInterface({ input: stream });

let data = [];
let numOrders = 0;

reader.on('line', (row) => {
  data.push(row.split(','));
  numOrders++;
});

reader.on('close', () => {
  averagePerOrder(data, numOrders);
  mostPopularBrand(data);
});

// Function: Determine the average amount ordered per product
const averagePerOrder = (data, numOrders) => {
  let totals = {};

  data.forEach((element) => {
    let keyName = element[2];
    let quantity = parseInt(element[3]);
    if (Object.keys(totals).includes(keyName)) {
      totals[keyName] += quantity;
    } else {
      totals[keyName] = quantity;
    }
  });

  // TODO: Refactor output to reusable function
  var averages = [];

  for (const [key, value] of Object.entries(totals)) {
    averages.push([`${key}, ${value / numOrders}`]);
  }

  let dataToWrite = '';

  averages.forEach((rowArray) => {
    dataToWrite += rowArray.join(',') + '\r\n';
  });

  fs.writeFile(`0_${fileName}`, dataToWrite, 'utf-8', (error) => {
    if (error) throw error;
    else {
      console.log(`File 0_${fileName} successfully created in ${__dirname}`);
    }
  });
};

// Function: Determine for each product what brand was order most frequently
const mostPopularBrand = (data) => {
  let brands = {};
  let products = {};

  data.forEach((element) => {
    let productName = element[2];
    let brandName = element[4];

    if (!Object.keys(products).includes(productName)) {
      products[productName] = [brandName];
    } else {
      if (!products[productName].includes(brandName)) {
        products[productName].push(brandName);
      }
    }

    if (!Object.keys(brands).includes(brandName)) {
      brands[brandName] = 1;
    } else {
      brands[brandName] += 1;
    }
  });

  let popularBrand = {};

  for (const [key, value] of Object.entries(products)) {
    popularBrand[key] = null;
    value.forEach((element) => {
      let currPopular = popularBrand[key];
      if (brands[element] > currPopular) {
        popularBrand[key] = element;
      }
    });
  }

  // TODO: Refactor file output to reusable function.
  var popular = [];

  for (const [key, value] of Object.entries(popularBrand)) {
    popular.push([`${key}, ${value}`]);
  }

  let dataToWrite = '';

  popular.forEach((rowArray) => {
    dataToWrite += rowArray.join(',') + '\r\n';
  });

  fs.writeFile(`1_${fileName}`, dataToWrite, 'utf-8', (error) => {
    if (error) throw error;
    else {
      console.log(`File 1_${fileName} successfully created in ${__dirname}`);
    }
  });
};
