
export const mindMapGenerator = {
  generateMindMap: async (topic: string, preferences: any) => {
    console.log('Generating mock mind map for topic:', topic);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      nodes: [
        { id: '1', label: topic, type: 'root', details: `Main concept of ${topic}` },
        { id: '2', label: 'Key Principles', type: 'branch', details: 'Fundamental rules and laws.' },
        { id: '3', label: 'Examples', type: 'branch', details: 'Real-world instances.' },
        { id: '4', label: 'Summary', type: 'branch', details: 'Quick recap of the topic.' }
      ],
      links: [
        { from: '1', to: '2' },
        { from: '1', to: '3' },
        { from: '1', to: '4' }
      ]
    };
  }
};
