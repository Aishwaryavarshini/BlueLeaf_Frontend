
export const nlpSegmentation = {
  segmentContent: async (rawText: string) => {
    console.log('Mock segmenting content');
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: 'seg-1', title: 'Introduction', content: 'Basic overview of the topic.' },
      { id: 'seg-2', title: 'Core Mechanics', content: 'Detailed explanation of how it works.' },
      { id: 'seg-3', title: 'Conclusion', content: 'Final thoughts and summary.' }
    ];
  }
};
