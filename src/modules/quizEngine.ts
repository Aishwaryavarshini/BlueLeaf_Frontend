
export const quizEngine = {
  generateQuiz: async (lessonContent: string) => {
    console.log('Generating mock quiz from content');
    await new Promise(resolve => setTimeout(resolve, 1200));
    return [
      {
        id: 1,
        text: "What is the primary focus of this lesson?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0,
        explanation: "Option A is correct because it directly addresses the core concept."
      },
      {
        id: 2,
        text: "Which of the following is an example mentioned in the text?",
        options: ["Example 1", "Example 2", "Example 3", "Example 4"],
        correctIndex: 1,
        explanation: "Example 2 was specifically highlighted in the lesson."
      }
    ];
  },
  evaluateQuiz: (answers: any[], correctAnswers: any[]) => {
    const score = answers.filter((a, i) => a === correctAnswers[i]).length;
    return { 
      score, 
      total: correctAnswers.length,
      feedback: score === correctAnswers.length ? "Perfect score!" : "Good effort, review the missed topics."
    };
  }
};
