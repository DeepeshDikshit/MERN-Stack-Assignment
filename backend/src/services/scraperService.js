import axios from 'axios';
import * as cheerio from 'cheerio';
import Story from '../models/Story.js';

const HACKER_NEWS_URL = 'https://news.ycombinator.com/';
const TOP_STORIES_LIMIT = 10;
const REQUEST_TIMEOUT = 10000;

// Parse time text
const parsePostedTime = (timeText) => {
  if (!timeText) return new Date();

  const now = new Date();
  const match = timeText.match(/(\d+)\s+(\w+)\s+ago/);

  if (!match) return now;

  const [, amount, unit] = match;
  const num = parseInt(amount, 10);

  switch (unit.toLowerCase()) {
    case 'second':
    case 'seconds':
      return new Date(now.getTime() - num * 1000);

    case 'minute':
    case 'minutes':
      return new Date(now.getTime() - num * 60 * 1000);

    case 'hour':
    case 'hours':
      return new Date(now.getTime() - num * 60 * 60 * 1000);

    case 'day':
    case 'days':
      return new Date(now.getTime() - num * 24 * 60 * 60 * 1000);

    default:
      return now;
  }
};

export const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get(HACKER_NEWS_URL, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const $ = cheerio.load(data);

    const stories = [];

    $('.athing')
      .slice(0, TOP_STORIES_LIMIT)
      .each((index, element) => {
        const titleElement = $(element)
          .find('.titleline a')
          .first();

        const title = titleElement.text().trim();

        const url =
          titleElement.attr('href') || '';

        const subtextRow = $(element).next();

        const points =
          parseInt(
            subtextRow.find('.score').text()
          ) || 0;

        const author =
          subtextRow
            .find('.hnuser')
            .text()
            .trim() || 'Unknown';

        const postedTime =
          subtextRow
            .find('.age')
            .text()
            .trim() || '';

        const commentsText =
          subtextRow.find('a').last().text();

        const commentsMatch =
          commentsText.match(/(\d+)/);

        const comments = commentsMatch
          ? parseInt(commentsMatch[1])
          : 0;

        console.log(`Story ${index + 1}: ${title}`);
        console.log(`Points: ${points}`);
        console.log(`Author: ${author}`);

        stories.push({
          title,
          url,
          points,
          author,
          postedAt: parsePostedTime(postedTime),
          comments,
          source: 'hackernews',
          scrapedAt: new Date(),
        });
      });

    console.log(
      `✅ Scraped ${stories.length} stories from Hacker News`
    );

    return stories;
  } catch (error) {
    console.error(
      '❌ Error scraping Hacker News:',
      error.message
    );

    throw new Error(
      `Failed to scrape Hacker News: ${error.message}`
    );
  }
};

export const saveStories = async (stories) => {
  try {
    let created = 0;
    let updated = 0;

    for (const story of stories) {
      const existingStory = await Story.findOne({
        title: story.title,
      });

      if (!existingStory) {
        await Story.create(story);
        created++;
      } else {
        existingStory.points = story.points;
        existingStory.comments = story.comments;
        existingStory.scrapedAt = new Date();

        await existingStory.save();

        updated++;
      }
    }

    console.log(
      `📊 Stories saved: ${created} new, ${updated} updated`
    );

    return { created, updated };
  } catch (error) {
    console.error(
      '❌ Error saving stories:',
      error.message
    );

    throw new Error(
      `Failed to save stories: ${error.message}`
    );
  }
};

export const runScraper = async () => {
  try {
    const stories = await scrapeHackerNews();

    const result = await saveStories(stories);

    return {
      success: true,
      message: 'Scraping completed successfully',
      storiesScraped: stories.length,
      ...result,
    };
  } catch (error) {
    console.error(
      '❌ Scraper failed:',
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};