#!/usr/bin/env node

import fetch from 'node-fetch';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import dotenv from "dotenv"
dotenv.config();
// Replace with your deployed worker URL
const API_URL = process.env.API_URL;

async function fetchStats() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
    const data = await res.json();

    console.log(boxen(chalk.bold('🌐 Website Analytics Summary'), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
    }));

    displaySection('📍 Country Breakdown', data.byCountry, 'country');
    displaySection('📱 Device Breakdown', data.byDevice, 'device');
    displaySection('🌐 Browser Breakdown', data.byBrowser, 'browser');
    displaySection('🔗 Referrer Breakdown', data.byReferrer, 'referrer');

  } catch (err) {
    console.error(chalk.red('❌ Error:'), err.message);
  }
}

function displaySection(title, rows, key) {
  console.log('\n' + chalk.blueBright.bold(title));
  const table = new Table({
    head: [chalk.gray(key.toUpperCase()), chalk.gray('COUNT')],
    colWidths: [30, 10],
  });

  rows.forEach(row => {
    table.push([row[key], row.count]);
  });

  console.log(table.toString());
}

fetchStats();
