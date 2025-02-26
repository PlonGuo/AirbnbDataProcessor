/**
 * @module AirBnBDataHandler
 */

import fs from 'fs/promises';
import csv from 'csv-parser';
import { parsePrice, parseNumber } from './utils.js';

/**
 * AirBnBDataHandler class to handle data loading, filtering, statistics, and ranking.
 */
class AirBnBDataHandler {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = [];
    this.filteredData = [];
    this.statistics = {};
    this.hostRanking = [];
  }

  /**
 * Loads CSV data from the specified file path.
 * Supports method chaining by returning the instance itself.
 * @returns {Promise<AirBnBDataHandler>} - The instance for chaining.
 */
async loadData() {
  const data = [];
  const fileStream = await fs.open(this.filePath, 'r');

  // Return the resolved instance to support chaining
  await new Promise((resolve, reject) => {
    fileStream.createReadStream()
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => {
        this.data = data;
        resolve();
      })
      .on('error', (error) => reject(error));
  });

  return this;  // Return `this` to support method chaining
}

  /**
   * Filters the listings based on the provided criteria.
   * @param {Object} criteria - The filter criteria.
   * @returns {AirBnBDataHandler} - The instance for chaining.
   */
  filterListings(criteria) {
    this.filteredData = this.data.filter((listing) => {
      const price = parsePrice(listing.price);
      const rooms = parseNumber(listing.bedrooms, 1);
      const reviewScore = parseNumber(listing.review_scores_rating);

      return (!criteria.minPrice || price >= criteria.minPrice) &&
             (!criteria.maxPrice || price <= criteria.maxPrice) &&
             (!criteria.minRooms || rooms >= criteria.minRooms) &&
             (!criteria.maxRooms || rooms <= criteria.maxRooms) &&
             (!criteria.minReviewScore || reviewScore >= criteria.minReviewScore) &&
             (!criteria.maxReviewScore || reviewScore <= criteria.maxReviewScore);
    });
    return this;
  }

  /**
   * Computes statistics on the filtered listings.
   * @returns {AirBnBDataHandler} - The instance for chaining.
   */
  computeStatistics() {
    const totalListings = this.filteredData.length;
    const pricePerRoom = this.filteredData.reduce((acc, listing) => {
      const price = parsePrice(listing.price);
      const rooms = parseNumber(listing.bedrooms, 1);
      return acc + price / rooms;
    }, 0) / totalListings;

    this.statistics = {
      totalListings,
      averagePricePerRoom: pricePerRoom.toFixed(2),
    };
    return this;
  }

  /**
   * Computes the number of listings per host and provides a ranking.
   * @returns {AirBnBDataHandler} - The instance for chaining.
   */
  computeHostRanking() {
    const hostMap = this.filteredData.reduce((acc, listing) => {
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

    this.hostRanking = Object.values(hostMap).sort((a, b) => b.listingsCount - a.listingsCount);
    return this;
  }

  /**
   * Exports the results to a specified file.
   * @param {string} filePath - The path to the output file.
   * @returns {Promise<AirBnBDataHandler>} - The instance for chaining.
   */
  async exportResults(filePath) {
    const jsonData = JSON.stringify({
      filteredListings: this.getFilteredData(),
      statistics: this.getStatistics(),
      hostRanking: this.getHostRanking(),
    }, null, 2);
    await fs.writeFile(filePath, jsonData, 'utf8');
    return this;
  }

  /**
   * Gets the loaded data.
   * @returns {Array<Object>} - The loaded data.
   */
  getData() {
    return this.data;
  }

  /**
   * Gets the filtered data.
   * @returns {Array<Object>} - The filtered data.
   */
  getFilteredData() {
    return this.filteredData;
  }

  /**
   * Gets the computed statistics.
   * @returns {Object} - The computed statistics.
   */
  getStatistics() {
    return this.statistics;
  }

  /**
   * Gets the computed host ranking.
   * @returns {Array<Object>} - The computed host ranking.
   */
  getHostRanking() {
    return this.hostRanking;
  }
}

export default (filePath) => new AirBnBDataHandler(filePath);