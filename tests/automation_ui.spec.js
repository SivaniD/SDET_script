const { test } = require('@playwright/test');

test('Amazon LG Soundbar product price sorting', async ({ page }) => {
  //  Open Amazon.in and take a screenshot after page loads
  await page.goto('https://www.amazon.in');
  await page.screenshot({ path: 'screenshots/step1_amazon_homepage.png' });

  //  Search for LG Soundbar
  await page.fill('#twotabsearchtextbox', 'lg soundbar');
  await page.click('input[type="submit"]');
  
  // Wait for search results to load and take a screenshot of the results page
  await page.waitForSelector('.s-main-slot');
  await page.screenshot({ path: 'screenshots/step3_search_results.png' });

  // Extract product names and prices from the first page
  const products = await page.$$eval('.s-main-slot .s-result-item', items => {
    return items.map(item => {
      const name = item.querySelector('h2 a span')?.textContent?.trim();
      let price = item.querySelector('.a-price-whole')?.textContent?.replace(/,/g, '');

      // If price is not available, set it as 0
      price = price ? parseFloat(price) : 0;

      // Return the product only if the name is defined
      return name ? { name, price } : null;
    }).filter(product => product !== null); 
  });

  //  Sort the products by price  and take a screenshot of sorted results
  products.sort((a, b) => a.price - b.price);
  await page.screenshot({ path: 'screenshots/step5_sorted_products.png' });

  // Print products with price and name
  products.forEach(product => {
    console.log(`₹${product.price} ${product.name}`);
  });
});


