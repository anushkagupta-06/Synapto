import React, { useEffect, useMemo, useState } from "react";
import { useMassBunk } from "../context/MassBunkContext";
import { useAuth } from "../context/contextapi";
import "./MassBunk.css";

const MassBunkPage = () => {
  const { activePoll, history, createPoll, votePoll, closePoll } = useMassBunk();
  const { localuser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState(null); // "yes" | "no" | null
  const [showFeedback, setShowFeedback] = useState(false);

  // If the backend returns current votes on the active poll, detect if this user has already voted.
  const userExistingVote = useMemo(() => {
    if (!activePoll || !localuser) return null;
    // activePoll.votes expected as [{ userId, vote }]
    const v = (activePoll.votes || []).find(
      (x) =>
        (x.userId?._id || x.userId) === (localuser?._id || localuser?.id)
    );
    return v?.vote ?? null;
  }, [activePoll, localuser]);

  useEffect(() => {
    if (userExistingVote) {
      setHasVoted(true);
      setVoteChoice(userExistingVote);
    } else {
      setHasVoted(false);
      setVoteChoice(null);
    }
  }, [userExistingVote, activePoll?._id]);

  const handleVote = async (vote) => {
    if (!activePoll?._id || isSubmitting || hasVoted) return;
    try {
      setIsSubmitting(true);
      await votePoll(activePoll._id, vote);
      setHasVoted(true);
      setVoteChoice(vote);
      setShowFeedback(true);
      // Auto-hide feedback after 3 seconds
      window.clearTimeout(window.__mb_feedback_to);
      window.__mb_feedback_to = window.setTimeout(() => setShowFeedback(false), 3000);
    } catch (e) {
      console.error("Vote failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const safePct = (yes, total) => (total ? Math.round((yes / total) * 100) : 0);

  return (
    <div className="mass-bunk-page">
      {localuser?.isAdmin && !activePoll && (
        <button
          className="create-poll"
          onClick={() => {
            const reason = prompt("Enter reason for mass bunk");
            if (reason?.trim()) createPoll(reason.trim());
          }}
        >
          Start Mass Bunk Poll
        </button>
      )}

      {activePoll && (
        <div className="poll-card" aria-live="polite">
          <h2>Mass Bunk: {activePoll.reason}</h2>
          <p>Cast your vote:</p>

          <div className="vote-actions">
            <button
              className={`vote-yes vote-btn ${
                (hasVoted && voteChoice !== "yes") ? "vote-btn--disabled" : ""
              }`}
              onClick={() => handleVote("yes")}
              disabled={isSubmitting || hasVoted}
            >
               Yes
            </button>
            <button
              className={`vote-no vote-btn ${
                (hasVoted && voteChoice !== "no") ? "vote-btn--disabled" : ""
              }`}
              onClick={() => handleVote("no")}
              disabled={isSubmitting || hasVoted}
            >
              No
            </button>
          </div>

          {/* Feedback line */}
          {showFeedback || hasVoted ? (
            <div className="vote-feedback">
              <span className="vote-feedback__icon">✔</span>
              <span>
                Response submitted{voteChoice ? `: ${voteChoice.toUpperCase()}` : ""}.
              </span>
            </div>
          ) : null}

          {localuser?.isAdmin && (
            <button
              className="close-poll"
              onClick={() => closePoll(activePoll._id)}
            >
              Close Poll
            </button>
          )}
        </div>
      )}

      <div className="poll-stats">
        <h3>Past Polls</h3>
        {history.map((poll) => {
          const yesVotes = poll.votes.filter((v) => v.vote === "yes");
          const noVotes = poll.votes.filter((v) => v.vote === "no");
          const total = yesVotes.length + noVotes.length;
          return (
            <div key={poll._id} className="poll-history-card">
              <h4>{poll.reason}</h4>
              <p>{safePct(yesVotes.length, total)}% said YES</p>
              <p>YES: {yesVotes.map((v) => v.userId?.name || "Unknown").join(", ") || "—"}</p>
              <p>NO: {noVotes.map((v) => v.userId?.name || "Unknown").join(", ") || "—"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MassBunkPage;
