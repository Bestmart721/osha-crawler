import { createCheerioRouter } from 'crawlee';
import mongoose from 'mongoose';
import { connect } from 'mongoose';

// Depth-first search enabled
const isDFS = true;

const connectToDatabase = async () => {
    try {
        await connect('mongodb+srv://mattfsliger:4AwJgBZLhHY0DprS@cluster0.qamlkeh.mongodb.net/oshaCrawler?retryWrites=true&w=majority&appName=Cluster0');
        // await connect('mongodb://localhost:27017/oshaCrawler');
        console.log('Connected to MongoDB');
        await mongoose.connection.collection('dates').deleteMany({});
        await mongoose.connection.collection('standards').deleteMany({});
        console.log('Truncated collections');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

connectToDatabase();

const dateSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    dates: [
        {
            date: { type: String, required: true },
            title: { type: String, required: true },
            url: { type: String, required: true },
        }
    ],
    url: { type: String, required: true },
});
const DateModel = mongoose.model('dates', dateSchema);

const oshaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    standardNumbers: {
        type: [
            {
                text: { type: String, required: true },
                url: { type: String, required: true },
            }
        ], required: true
    },
    content: { type: String, required: true },
});
export const OshaModel = mongoose.model('standards', oshaSchema);

export const router = createCheerioRouter();

// Add a default handler that will be called for all pages
router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`years handler`);

    await enqueueLinks({
        globs: ['**/laws-regs/standardinterpretations/publicationdate/[0-9][0-9][0-9][0-9]'],
        label: 'year',
        forefront: isDFS,
    });
});

// Add a handler for pages that match the glob `**/laws-regs/standardinterpretations/publicationdate/[0-9][0-9][0-9][0-9]`
router.addHandler('year', async ({ request, $, log, enqueueLinks }) => {
    const url = request.loadedUrl;
    const match = url.match(/publicationdate\/(\d{4})/);
    const year = match ? match[1] : 'unknown';

    log.info(`scraping year ${year}`);

    const dateLinks = $('a')
        .map((_, el) => ({ href: $(el).attr('href'), text: $(el).text() }))
        .get()
        .filter((el) => el.href && el.href.includes('/laws-regs/standardinterpretations/' + year))
        .map((el) => {
            const match = (el.href ?? '').match(/standardinterpretations\/(\d{4})-(\d{2})-(\d{2})(?:-\d+)?/);
            const [_, year, month, day] = match || [];
            const title = el.text.trim();
            const date = `${year}-${month}-${day}`;
            return { date, title, url: el.href };
        });

    await DateModel.create({
        year, dates: dateLinks, url
    });

    await enqueueLinks({
        urls: dateLinks.map(el => el.url).filter((url): url is string => url !== undefined),
        label: 'date',
        forefront: isDFS,
    });
});

// Add a handler for pages that match the glob `**/laws-regs/standardinterpretations/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]`
router.addHandler('date', async ({ request, $, log }) => {
    const url = request.loadedUrl;
    const match = url.match(/standardinterpretations\/(\d{4})-(\d{2})-(\d{2})(?:-\d+)?/);
    const [_, year, month, day] = match || [];
    const date = `${year}-${month}-${day}`
    log.info(`scraping date ${date}`);

    const title = $('title').text().replace(' | Occupational Safety and Health Administration', '');
    const content = $('article').html();
    const standardNumbers = $('article a')
        .map((_, el) => ({ url: $(el).attr('href'), text: $(el).text().trim() }))
        .get()
        .filter((el) => el.url && el.url.includes('/laws-regs/interlinking/standards/'))

    await OshaModel.create({
        url,
        title,
        date,
        standardNumbers: standardNumbers,
        content,
    });

    // await pushData({
    //     urls: links,
    //     label: 'standard',
    // });
})