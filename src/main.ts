// For more information, see https://www.osha.gov/laws-regs/standardinterpretations/publicationdate/
import { CheerioCrawler, ProxyConfiguration } from 'crawlee';

import { router } from './routes.js';

const startUrls = ['https://www.osha.gov/laws-regs/standardinterpretations/publicationdate'];

const crawler = new CheerioCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    // maxRequestsPerCrawl: 20,
    maxConcurrency: 1,
});

await crawler.run(startUrls);
