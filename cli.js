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
    const filePath = await question('Please enter the name of the CSV file: ~> ');

    console.log('Loading data...');
    const handler = AirBnBDataHandler(filePath);

    await handler.loadData();
    // Method Chaining 
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

    console.log(`Loaded ${handler.getData().length} listings.`);
    console.log(`Filtered ${handler.getFilteredData().length} listings based on your criteria.`);

    console.log('*********');
    console.log('Filtered Listings (ID and Price):');
    handler.getFilteredData().forEach(listing => {
      console.log(`ID: ${listing.id}, Price: $${listing.price}`);
    });

    console.log('*********');
    console.log('Computing statistics...');
    const stats = handler.getStatistics();
    console.log(`Total Listings: ${stats.totalListings}`);
    console.log(`Average Price per Room: $${stats.averagePricePerRoom}`);

    console.log('*********');
    console.log('Computing host ranking...');
    const hostRanking = handler.getHostRanking();

    if (hostRanking.length > 0) {
      hostRanking.forEach(host => {
        console.log(`Host: ${host.hostName} | Listings: ${host.listingsCount}`);
      });
    } else {
      console.log('No host data available for ranking.');
    }

    const exportChoice = await question('Would you like to export the results? (yes/no) ~> ');
    if (exportChoice.toLowerCase() === 'yes') {
      const exportFilePath = await question('Enter the output file name (e.g., results.json): ~> ');
      await handler.exportResults(exportFilePath);
      console.log(`Results exported to ${exportFilePath}`);
    }

    rl.close();
  } catch (error) {
    console.error('An error occurred:', error);
    rl.close();
  }
};

main();