
import { UserPreferences } from "../App";

// Mock implementation of AI service to remove external dependencies
export const aiService = {
  async generateLessonContent(lessonTitle: string, unitName: string, subject: string, preferences: UserPreferences) {
    const { language } = preferences;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      analogy: `Imagine ${lessonTitle} is like a local village market where everything is organized in specific stalls. --- ${lessonTitle} can be understood as a structured system of categorization, similar to how items are arranged in a marketplace.`,
      core_concept: `The core idea of ${lessonTitle} in ${subject} is about understanding how different elements interact within the ${unitName} framework. --- In the context of ${unitName}, ${lessonTitle} represents the fundamental principles governing the behavior and properties of the subject matter.`,
      examples: [
        `Like counting the number of coconut trees in a grove. --- Similar to the process of enumerating discrete elements within a defined set.`,
        `Organizing your school books by subject. --- Analogous to the systematic classification of data based on shared attributes.`
      ],
      summary: [
        `Understanding the basics of ${lessonTitle}.`,
        `Learning how to apply ${lessonTitle} in real-world scenarios.`,
        `Mastering the key terminology related to ${unitName}.`
      ],
      bridge: [
        `Concept - கருத்தாக்கம் (Karuthakkam)`,
        `Structure - அமைப்பு (Amaippu)`,
        `Example - உதாரணம் (Udharanam)`
      ],
      interactive_challenge: `Can you think of another example from your daily life that follows the same pattern as ${lessonTitle}?`
    };
  },

  async generateQuiz(unitName: string, subject: string, classGrade: number, quizType: string, preferences: UserPreferences, lessonTitle?: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const questions = [];
    for (let i = 1; i <= 5; i++) {
      questions.push({
        id: i,
        text: `Sample Question ${i} about ${lessonTitle || unitName} for Grade ${classGrade}?`,
        options: [
          `Option A for ${subject}`,
          `Option B for ${subject}`,
          `Option C for ${subject}`,
          `Option D for ${subject}`
        ],
        correctIndex: Math.floor(Math.random() * 4),
        optionExplanations: [
          "Explanation for A in local language --- Formal English explanation for A.",
          "Explanation for B in local language --- Formal English explanation for B.",
          "Explanation for C in local language --- Formal English explanation for C.",
          "Explanation for D in local language --- Formal English explanation for D."
        ]
      });
    }
    return questions;
  },

  async generateFlashcards(unitName: string, preferences: UserPreferences) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      { id: '1', front: `What is the main definition of ${unitName}?`, back: `It is the study of fundamental principles. --- It refers to the basic theoretical framework of the subject.` },
      { id: '2', front: `Give an example of ${unitName} in daily life.`, back: `Like sunlight helping plants grow. --- Photosynthesis is a primary example of energy conversion.` },
      { id: '3', front: `Why is ${unitName} important?`, back: `It helps us understand the world around us. --- It provides a scientific basis for natural phenomena.` },
      { id: '4', front: `Who first discovered the concepts in ${unitName}?`, back: `Many ancient scholars contributed to this. --- The field evolved through centuries of scientific inquiry.` },
      { id: '5', front: `What is a key formula in ${unitName}?`, back: `A simple relationship between parts. --- A mathematical expression of the underlying laws.` }
    ];
  },

  async generateMindMap(unitName: string, preferences: UserPreferences) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      nodes: [
        { id: 'root', label: unitName, type: 'core' as const, details: `Main topic: ${unitName}`, x: 0, y: 0 },
        { id: 'n1', label: 'Basic Concepts', type: 'branch' as const, details: 'The foundation of the topic.', x: 0, y: 0 },
        { id: 'n2', label: 'Applications', type: 'branch' as const, details: 'How it is used in real life.', x: 0, y: 0 },
        { id: 'n3', label: 'Key Formulas', type: 'branch' as const, details: 'Mathematical representations.', x: 0, y: 0 },
        { id: 'n1-1', label: 'Definitions', type: 'leaf' as const, details: 'Standard terminology.', x: 0, y: 0 },
        { id: 'n2-1', label: 'Industry Use', type: 'leaf' as const, details: 'Professional applications.', x: 0, y: 0 }
      ],
      links: [
        { from: 'root', to: 'n1' },
        { from: 'root', to: 'n2' },
        { from: 'root', to: 'n3' },
        { from: 'n1', to: 'n1-1' },
        { from: 'n2', to: 'n2-1' }
      ]
    };
  },

  async modifyMindMap(currentData: any, prompt: string, preferences: UserPreferences) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock modification: add a new node based on the prompt
    const newNodeId = `new-${Date.now()}`;
    return {
      nodes: [
        ...currentData.nodes,
        { id: newNodeId, label: `Added: ${prompt}`, type: 'branch' as const, details: `Details for ${prompt}`, x: 0, y: 0 }
      ],
      links: [
        ...currentData.links,
        { from: 'root', to: newNodeId }
      ]
    };
  },

  async expandNode(node: any, type: 'explain' | 'example' | 'formula' | 'simplify' | 'not_clear', preferences: UserPreferences) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newNodeId = `exp-${Date.now()}`;
    const nodeType = type === 'formula' ? 'formula' : (type === 'example' ? 'example' : 'branch');
    return {
      newNodes: [
        { id: newNodeId, label: `${type.toUpperCase()} of ${node.label}`, type: nodeType as any, details: `Expanded details for ${node.label} using ${type}.`, x: 0, y: 0 }
      ],
      newLinks: [
        { from: node.id, to: newNodeId }
      ]
    };
  },

  async evaluateFlashcardAnswer(question: string, correctAnswer: string, userAnswer: string, preferences: UserPreferences): Promise<{ status: 'green' | 'yellow' | 'red', feedback: string, missedIdeas: string[], badgeText: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isCorrect = userAnswer.length > 5; // Simple mock logic
    
    return {
      status: isCorrect ? "green" : "yellow",
      feedback: isCorrect ? "Great job! You understood the core concept." : "You're on the right track, but missed some key details.",
      missedIdeas: isCorrect ? [] : ["Specific terminology", "Practical application"],
      badgeText: isCorrect ? "Concept Master" : "Keep Learning"
    };
  },

  async sendMessageStream(message: string, history: any[], systemInstruction: string) {
    // Mock streaming response
    const mockResponse = `This is a mock response to: "${message}". In a real scenario, this would be generated by an AI model based on the syllabus and your preferences. Since we are in mock mode, I'm providing this static text to demonstrate the UI flow.`;
    
    return {
      async *[Symbol.asyncIterator]() {
        const words = mockResponse.split(' ');
        for (const word of words) {
          await new Promise(resolve => setTimeout(resolve, 50));
          yield { text: word + ' ' };
        }
      }
    };
  },

  async generateTTS(text: string, voice: string): Promise<string | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real mock, we might return a base64 of a silent audio or a pre-recorded one
    // For now, we return null or a very short dummy base64 if needed.
    // Returning null will just make it not play, which is fine for a frontend-only mock if we don't have assets.
    return null; 
  },

  async connectLive(config: any, callbacks: any) {
    console.log("Mock Live Session connected with config:", config);
    
    // Simulate a successful connection
    setTimeout(() => {
      if (callbacks.onopen) callbacks.onopen();
    }, 500);

    return {
      sendRealtimeInput: (input: any) => {
        console.log("Mock Live Input received:", input);
        // Simulate some transcription feedback
        if (callbacks.onmessage) {
          callbacks.onmessage({
            serverContent: {
              inputTranscription: { text: "User is speaking..." }
            }
          });
        }
      },
      close: () => {
        console.log("Mock Live Session closed");
        if (callbacks.onclose) callbacks.onclose();
      }
    };
  }
};
