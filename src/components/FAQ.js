import { useMemo, useState } from "react";
import questions from "../data/faqs.json";

function FAQ() {
  const [keyword, setKeyword] = useState("");
  const term = keyword.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!term) return questions;
    return questions.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term)
    );
  }, [term]);

  return (
    <main className="faq-main">
      <div className="faq-search-wrap">
        <label htmlFor="faqSearch">Search</label>
        <input
          id="faqSearch"
          type="search"
          name="search"
          placeholder="Keywords"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          autoFocus
        />
      </div>
      <p className="faq-status" role="status">
        {matches.length === 0
          ? `No questions match "${keyword.trim()}".`
          : term
            ? `${matches.length} question${matches.length === 1 ? "" : "s"} found.`
            : `${questions.length} questions. Type a keyword to filter them.`}
      </p>
      <div className="faq-list">
        {matches.map((item) => (
          <article className="faq-card" key={item.question}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

export default FAQ;
