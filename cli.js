/**
 * @module CLI
 */

import readline from 'readline';
import AirBnBDataHandler from './AirBnBDataHandler.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Promisified version of readline.question for easier async/await usage.
 * @memberof module:CLI
 * @param {string} query - The question to prompt the user.
 * @returns {Promise<string>} - A promise that resolves to the user's input.
 */
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Main function to run the CLI application.
 * Utilizes Method Chaining for better readability and flow.
 * @memberof module:CLI
 */
const main = async () => {
  try {
    console.log('\n============================');
    console.log('    Airbnb Data Processor    ');
    console.log('============================\n');

    const filePath = await question('Please enter the file name (CSV/ZIP/GZ): ~> ');

    console.log('\nLoading data...');
    const handler = AirBnBDataHandler(filePath);

    await handler.loadData();
    console.log(`\nLoaded ${handler.getData().length} listings.\n`);

    console.log('Applying filters...');
    handler
      .filterListings({
        minPrice: parseFloat(await question('Enter minimum price (or press Enter to skip): ~> ')) || undefined,
        maxPrice: parseFloat(await question('Enter maximum price (or press Enter to skip): ~> ')) || undefined,
        minRooms: parseInt(await question('Enter minimum number of rooms (or press Enter to skip): ~> '), 10) || undefined,
        maxRooms: parseInt(await question('Enter maximum number of rooms (or press Enter to skip): ~> '), 10) || undefined,
        minReviewScore: parseFloat(await question('Enter minimum review score (or press Enter to skip): ~> ')) || undefined,
        maxReviewScore: parseFloat(await question('Enter maximum review score (or press Enter to skip): ~> ')) || undefined
      })
      .computeStatistics()
      .computeHostRanking();

    console.log('\n============================');
    console.log('     Filtered Listings       ');
    console.log('============================');
    console.log(`\nFiltered ${handler.getFilteredData().length} listings based on your criteria.\n`);

    console.log('*********');
    console.log('Filtered Listings (ID and Price):');
    handler.getFilteredData().slice(0, 10).forEach(listing => {
      console.log(`  - ID: ${listing.id}, Price: $${listing.price}`);
    });
    if (handler.getFilteredData().length > 10) {
      console.log(`  ...and ${handler.getFilteredData().length - 10} more listings.`);
    }
    console.log('*********\n');

    console.log('Computing statistics...');
    const stats = handler.getStatistics();
    console.log('\n============================');
    console.log('        Statistics           ');
    console.log('============================');
    console.log(`Total Listings: ${stats.totalListings}`);
    console.log(`Average Price per Room: $${stats.averagePricePerRoom}\n`);

    console.log('============================');
    console.log('       Host Ranking          ');
    console.log('============================');
    const hostRanking = handler.getHostRanking();
    if (hostRanking.length > 0) {
      hostRanking.slice(0, 5).forEach((host, index) => {
        console.log(`  ${index + 1}. Host: ${host.hostName} | Listings: ${host.listingsCount}`);
      });
      if (hostRanking.length > 5) {
        console.log(`  ...and ${hostRanking.length - 5} more hosts.`);
      }
    } else {
      console.log('No host data available for ranking.');
    }

    console.log('\n============================');
    console.log('         Export Data         ');
    console.log('============================');
    const exportChoice = await question('Would you like to export the results? (yes/no) ~> ');
    if (exportChoice.toLowerCase() === 'yes') {
      const exportFilePath = await question('Enter the output file name (e.g., results.json): ~> ');
      await handler.exportResults(exportFilePath);
      console.log(`\nResults successfully exported to ${exportFilePath}`);
    } else {
      console.log('Results not exported.');
    }

    console.log('\n============================');
    console.log('       Process Complete      ');
    console.log('============================\n');

    rl.close();
  } catch (error) {
    console.error('\nAn error occurred:', error.message);
    console.log('Please check your file and try again.');
    rl.close();
  }
};

main();