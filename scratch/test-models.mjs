import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('https://gen.pollinations.ai/image/models');
    const data = await res.json();
    console.log('Image Models:', JSON.stringify(data, null, 2));
    
    const res2 = await fetch('https://gen.pollinations.ai/v1/models');
    const data2 = await res2.json();
    console.log('Unified Models:', JSON.stringify(data2, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
