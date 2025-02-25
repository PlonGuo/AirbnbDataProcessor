/**
 * @module CLI
 */

import readline from 'readline';
import {
  loadData,
  filterListings,
  computeStatistics,
  computeHostRanking,
  exportResults,
} from './AirBnBDataHandler.js';

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
 */
const main = async () => {
  try {
    const filePath = await question('Please enter the name of the CSV file: ~> ');

    console.log('Loading data...');
    const listings = await loadData(filePath);
    console.log(`Loaded ${listings.length} listings.`);

    const minPrice = parseFloat(await question('Enter minimum price (or press Enter to skip): ~> ')) || undefined;
    const maxPrice = parseFloat(await question('Enter maximum price (or press Enter to skip): ~> ')) || undefined;
    const minRooms = parseInt(await question('Enter minimum number of rooms (or press Enter to skip): ~> '), 10) || undefined;
    const maxRooms = parseInt(await question('Enter maximum number of rooms (or press Enter to skip): ~> '), 10) || undefined;
    const minReviewScore = parseFloat(await question('Enter minimum review score (or press Enter to skip): ~> ')) || undefined;
    const maxReviewScore = parseFloat(await question('Enter maximum review score (or press Enter to skip): ~> ')) || undefined;

    console.log('Filtering listings...');
    const filteredListings = filterListings(listings, {
      minPrice,
      maxPrice,
      minRooms,
      maxRooms,
      minReviewScore,
      maxReviewScore,
    });

    console.log(`Filtered ${filteredListings.length} listings based on your criteria.`);

    console.log('Computing statistics...');
    const stats = computeStatistics(filteredListings);
    console.log('Statistics:', stats);

    console.log('Computing host ranking...');
    const hostRanking = computeHostRanking(filteredListings);
    console.log('Host Ranking:', hostRanking);

    const exportChoice = await question('Would you like to export the results? (yes/no) ~> ');
    if (exportChoice.toLowerCase() === 'yes') {
      const exportFilePath = await question('Enter the output file path (e.g., results.json): ~> ');
      await exportResults(exportFilePath, {
        filteredListings,
        stats,
        hostRanking,
      });
      console.log(`Results exported to ${exportFilePath}`);
    }

    rl.close();
  } catch (error) {
    console.error('An error occurred:', error);
    rl.close();
  }
};

main();