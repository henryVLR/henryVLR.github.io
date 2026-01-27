const { KVStore } = require('@netlify/functions');

exports.handler = async (event, context) => {
  const store = new KVStore();
  const key = 'view-count';

  if (event.httpMethod === 'GET') {
    const count = await store.get(key) || 0;
    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  if (event.httpMethod === 'POST') {
    const current = await store.get(key) || 0;
    const updated = parseInt(current) + 1;
    await store.set(key, updated.toString());
    return {
      statusCode: 200,
      body: JSON.stringify({ count: updated }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};