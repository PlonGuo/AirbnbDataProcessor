/**
 * @module AirBnBDataHandler
 */

import fs from 'fs/promises';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import zlib from 'zlib';
import AdmZip from 'adm-zip';
import { parsePrice, parseNumber } from './utils.js';

const AirBnBDataHandler = (filePath) => {
  let data = [];
  let filteredData = [];
  let statistics = {};
  let hostRanking = [];

  /**
   * Loads CSV data from different file types (.csv, .zip, .gz)
   * Supports method chaining by returning the instance itself.
   * @returns {Promise<AirBnBDataHandler>} - The instance for chaining.
   */
  const loadData = async () => {
    const tempData = [];

    // Determine file extension
    const fileExtension = filePath.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      await new Promise((resolve, reject) => {
        createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => tempData.push(row))
          .on('end', () => {
            data = tempData;
            resolve();
          })
          .on('error', (error) => reject(error));
      });
    } else if (fileExtension === 'gz') {
      await new Promise((resolve, reject) => {
        createReadStream(filePath)
          .pipe(zlib.createGunzip())
          .pipe(csv())
          .on('data', (row) => tempData.push(row))
          .on('end', () => {
            data = tempData;
            resolve();
          })
          .on('error', (error) => reject(error));
      });
    } else if (fileExtension === 'zip') {
      const zip = new AdmZip(filePath);
      const zipEntries = zip.getEntries();
      for (const entry of zipEntries) {
        if (entry.entryName.endsWith('.csv')) {
          const csvContent = entry.getData().toString('utf8');
          const rows = csvContent.split('\n');
          rows.forEach((line) => {
            const cols = line.split(',');
            if (cols.length > 1) {
              const rowObj = {};
              cols.forEach((col, index) => {
                rowObj[`col${index}`] = col;
              });
              tempData.push(rowObj);
            }
          });
        }
      }
      data = tempData;
    } else {
      throw new Error('Unsupported file type. Please provide a .csv, .zip, or .gz file.');
    }

    return handler;
  };

  const filterListings = (criteria) => {
    filteredData = data.filter((listing) => {
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
    return handler;
  };

  const computeStatistics = () => {
    const totalListings = filteredData.length;
    const pricePerRoom = filteredData.reduce((acc, listing) => {
      const price = parsePrice(listing.price);
      const rooms = parseNumber(listing.bedrooms, 1);
      return acc + price / rooms;
    }, 0) / totalListings;

    statistics = {
      totalListings,
      averagePricePerRoom: pricePerRoom.toFixed(2),
    };
    return handler;
  };

  const computeHostRanking = () => {
    const hostMap = filteredData.reduce((acc, listing) => {
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

    hostRanking = Object.values(hostMap).sort((a, b) => b.listingsCount - a.listingsCount);
    return handler;
  };

  const exportResults = async (outputFilePath) => {
    const jsonData = JSON.stringify({
      filteredListings: getFilteredData(),
      statistics: getStatistics(),
      hostRanking: getHostRanking(),
    }, null, 2);
    await fs.writeFile(outputFilePath, jsonData, 'utf8');
    return handler;
  };

  const getData = () => data;
  const getFilteredData = () => filteredData;
  const getStatistics = () => statistics;
  const getHostRanking = () => hostRanking;

  const handler = {
    loadData,
    filterListings,
    computeStatistics,
    computeHostRanking,
    exportResults,
    getData,
    getFilteredData,
    getStatistics,
    getHostRanking,
  };

  return handler;
};

export default AirBnBDataHandler;