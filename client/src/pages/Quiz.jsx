import { useState } from "react";
import "./Quiz.css";
import { useGoogle } from "../context/googleapi.jsx";

export default function Quiz() {
  const { quizData, quizloading } = useGoogle();

  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (qIndex, answer) => {
    setUserAnswers({ ...userAnswers, [qIndex]: answer });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (quizloading) {
    return (
      <div className="quiz-container">
        <div className="loader">⏳ Generating Quiz...</div>
      </div>
    );
  }

  if (!quizData || quizData.length === 0) {
    return (
      <div className="quiz-container">
        <p className="no-quiz">❌ No quiz data available for this file.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>📘 Quiz</h2>
        <button className="back-button" onClick={() => window.history.back()}>
          ← Back
        </button>
      </div>

      <div className="quiz-body">
        {quizData.map((q, i) => (
          <div key={i} className="quiz-question-card">
            <p className="quiz-question">
              <strong>Q{i + 1}.</strong> {q.question}
            </p>
            <div className="quiz-options">
              {q.options.map((opt, idx) => {
                const label = opt.charAt(0);
                const selected = userAnswers[i] === label;
                const correct = q.answer === label;

                const isCorrect = submitted && selected && correct;
                const isWrong = submitted && selected && !correct;

                return (
                  <label
                    key={idx}
                    className={`quiz-option ${isCorrect ? "correct" : ""} ${
                      isWrong ? "wrong" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={label}
                      disabled={submitted}
                      checked={selected}
                      onChange={() => handleOptionChange(i, label)}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>

            {submitted && (
              <div className="answer-feedback">
                Correct Answer: <strong>{q.answer}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Quiz
        </button>
      ) : (
        <p className="quiz-score">
          Score:{" "}
          {
            Object.entries(userAnswers).filter(
              ([i, ans]) => quizData[i].answer === ans
            ).length
          }{" "}
          / {quizData.length}
        </p>
      )}
    </div>
  );
}
