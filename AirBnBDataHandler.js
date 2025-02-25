/**
 * @module AirBnBDataHandler
 */

import fs from 'fs/promises';
import csv from 'csv-parser';

/**
 * Loads CSV data from the specified file path.
 * @memberof module:AirBnBDataHandler
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of listing objects.
 */
const loadData = async (filePath) => {
  const data = [];
  const fileStream = await fs.open(filePath, 'r');
  return new Promise((resolve, reject) => {
    fileStream.createReadStream()
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => resolve(data))
      .on('error', (error) => reject(error));
  });
};

/**
 * Filters the listings based on the provided criteria.
 * @memberof module:AirBnBDataHandler
 * @param {Array<Object>} listings - The array of listing objects.
 * @param {Object} criteria - The filter criteria.
 * @param {number} [criteria.minPrice] - The minimum price.
 * @param {number} [criteria.maxPrice] - The maximum price.
 * @param {number} [criteria.minRooms] - The minimum number of rooms.
 * @param {number} [criteria.maxRooms] - The maximum number of rooms.
 * @param {number} [criteria.minReviewScore] - The minimum review score.
 * @param {number} [criteria.maxReviewScore] - The maximum review score.
 * @returns {Array<Object>} - The filtered array of listing objects.
 */
const filterListings = (listings, criteria) => {
  return listings.filter((listing) => {
    const price = parseFloat(listing.price.replace(/[^0-9.-]+/g, ''));
    const rooms = parseInt(listing.bedrooms, 10);
    const reviewScore = parseFloat(listing.review_scores_rating);

    return (!criteria.minPrice || price >= criteria.minPrice) &&
           (!criteria.maxPrice || price <= criteria.maxPrice) &&
           (!criteria.minRooms || rooms >= criteria.minRooms) &&
           (!criteria.maxRooms || rooms <= criteria.maxRooms) &&
           (!criteria.minReviewScore || reviewScore >= criteria.minReviewScore) &&
           (!criteria.maxReviewScore || reviewScore <= criteria.maxReviewScore);
  });
};

/**
 * Computes statistics on the filtered listings.
 * @param {Array<Object>} listings - The array of filtered listing objects.
 * @returns {Object} - An object containing the count of listings and average price per number of rooms.
 */
const computeStatistics = (listings) => {
  const totalListings = listings.length;
  const pricePerRoom = listings.reduce((acc, listing) => {
    const price = parseFloat(listing.price.replace(/[^0-9.-]+/g, ''));
    const rooms = parseInt(listing.bedrooms, 10) || 1; // Default to 1 if bedrooms is not a number
    return acc + price / rooms;
  }, 0) / totalListings;

  return {
    totalListings,
    averagePricePerRoom: pricePerRoom.toFixed(2),
  };
};

/**
 * Computes the number of listings per host and provides a ranking.
 * @param {Array<Object>} listings - The array of listing objects.
 * @returns {Array<Object>} - An array of hosts sorted by the number of listings in descending order.
 */
const computeHostRanking = (listings) => {
  const hostMap = listings.reduce((acc, listing) => {
    const hostId = listing.host_id;
    if (!acc[hostId]) {
      acc[hostId] = {
        hostId,
        hostName: listing.host_name,
        listingsCount: 0,
      };
    }
    acc[hostId].listingsCount += 1;
    return acc;
  }, {});

  return Object.values(hostMap).sort((a, b) => b.listingsCount - a.listingsCount);
};

/**
 * Exports the results to a specified file.
 * @param {string} filePath - The path to the output file.
 * @param {Object} data - The data to be written to the file.
 * @returns {Promise<void>} - A promise that resolves when the file has been written.
 */
const exportResults = async (filePath, data) => {
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonData, 'utf8');
};

export {
  loadData,
  filterListings,
  computeStatistics,
  computeHostRanking,
  exportResults,
};